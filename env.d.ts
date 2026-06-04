declare namespace App {
    interface Locals {
        syntaxesData: {
            addons: string[],
            version: string,
            types: {
                id: string,
                name: string,
                codename: {
                    singular: string,
                    plural: string,
                }
            }[],
        },
    }
}
