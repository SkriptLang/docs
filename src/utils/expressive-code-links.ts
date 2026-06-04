/**
 * This file is adapted from https://github.com/towc/expressive-code-links
 * License below:
 *
 * MIT License
 *
 * Copyright (c) 2026 Matei Copot
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
import { definePlugin, ExpressiveCodeAnnotation, type AnnotationRenderOptions } from '@expressive-code/core'
import { h } from '@expressive-code/core/hast';

function getRegex() {
    // \[link](url)
    return /\\\[([^\]]+)]\(([^)]+)\)/g;
}

export function expressiveCodeLinksPlugin() {
    return definePlugin({
        name: 'Expressive Code Links',
        hooks: {
            preprocessCode: (context) => {
                for (const line of context.codeBlock.getLines()) {
                    const matches = [...line.text.matchAll(getRegex())];

                    // account for multiple links in one line
                    let offset = 0;

                    for (const match of matches) {
                        const [original, link, href] = match;

                        const from = (match.index || 0) - offset;
                        const to = from + original.length;

                        line.addAnnotation(
                            new LinkAnnotation({
                                href,
                                inlineRange: {
                                    columnStart: from,
                                    columnEnd: to,
                                }
                            })
                        );
                        // this already culls annotation
                        line.editText(from, to, link);

                        offset += original.length - link.length;
                    }
                }
            }
        },
    })
}

class LinkAnnotation extends ExpressiveCodeAnnotation {
    href: string;
    constructor(options: ConstructorParameters<typeof ExpressiveCodeAnnotation>[0] & { href: string }) {
        const { href, ...original } = options;
        super(original);

        this.href = href;
    }
    render({ nodesToTransform }: AnnotationRenderOptions) {
        return nodesToTransform.map((node) => {
            if (node.type !== 'element') {
                // e.g.
                //   con[st x](href) = 1
                //
                // `const` and `x` are put in different `spans`s by EC
                // in order for syntax highlight to work.

                type Node = object & { value?: string, children?: Node[] };

                const getText = (el: Node): string =>
                    el.value ?? el.children?.map(getText).join('') ?? '';

                throw new Error(
                    '[expressive-code-links]: Used link annotation spanning multiple expressive-code elements:\n'
                    + '  ' + getText(node)
                );
            }

            return h(
                node.tagName,
                node.properties,
                h(
                    'a.ec-link',
                    {
                        href: this.href,
                        style: 'color: inherit',
                    },
                    ...node.children
                )
            )
        })
    }
}
