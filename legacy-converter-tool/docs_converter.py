import json
import re
from pathlib import Path

def convert_docs(from_data):
    to_data = {}

    # generator data
    to_data['generator'] = {'version': {'major': 999, 'minor': 0}}

    # source data
    if 'skriptVersion' in from_data:
        to_data['source'] = {'name': 'Skript', 'version': from_data['skriptVersion']}
    elif 'source' in from_data:
        to_data['source'] = from_data['source']

    to_data['types'] = convert_docs_datas('classes' if 'classes' in from_data else 'types', from_data, create_type_data)
    to_data['structures'] = convert_docs_datas('structures', from_data, create_structure_data)
    to_data['events'] = convert_docs_datas('events', from_data, create_event_data)
    to_data['sections'] = convert_docs_datas('sections', from_data, create_section_data)
    to_data['effects'] = convert_docs_datas('effects', from_data, create_effect_data)
    to_data['conditions'] = convert_docs_datas('conditions', from_data, create_condition_data)
    to_data['expressions'] = convert_docs_datas('expressions', from_data, create_expression_data)
    to_data['functions'] = convert_docs_datas('functions', from_data, create_function_data)
    to_data['properties'] = convert_docs_datas('properties', from_data, create_property_data)
    to_data['experiments'] = convert_docs_datas('experiments', from_data, create_experiment_data)
    to_data['entitydata'] = {}

    return to_data

def convert_docs_datas(key, datas, converter):
    converted_datas = {}
    if key in datas:
        for data in datas[key]:
            if 'end' in data:
                break
            converted_data = converter(data)
            converted_datas[converted_data['id']] = converted_data
    return converted_datas

def process_description(description):
    if description is None:
        return ''
    if isinstance(description, list):
        description = '\n'.join(description)
    else:
        description = description.replace('\\n', '\n')
    return re.sub(r"<a href='[^#]*#(.+?)'>(.+?)</a>", r"[\2](docs:Skript/\1)", description)

def process_examples(examples):
    if examples is None or examples == "Missing examples.":
        return []
    if isinstance(examples, str):
        examples = [examples]
    fixed_examples = []
    current_example = ''
    for example in examples:
        example = example.replace('\\n', '\n').replace('    ', '\t').replace('&lt;', '<').replace('&gt;', '>')
        if len(example) > 0 and current_example != '' and (example[0] != '\t' or '\n' in example):
            fixed_examples.append(current_example)
            current_example = ''
        if current_example != '':
            current_example += '\n'
        current_example += example
    if current_example != '':
        fixed_examples.append(current_example)
    return fixed_examples

def process_since(since):
    if since is None:
        return ["Unknown"]
    if isinstance(since, str):
        since = [since]
    return [entry.replace("INSERT VERSION", "Unknown") for entry in since]

def process_patterns(patterns):
    if patterns is None or patterns[0] == "Missing patterns.":
        return []
    if patterns[-1] == 'pattern_end':
        patterns = patterns[:-1]
    patterns = [re.sub(r"<a href='[^#]*#(.+?)'>(.+?)</a>", r"\1", pattern) for pattern in patterns]
    return patterns

def create_documentation():
    documentation = {
        'origin': {
            'name': 'Skript',
        },
        'id': None,
        'name': 'Unknown',
        'description': '',
        'examples': [],
        'since': [],
        'requirements': [],
        'keywords': [],
        'deprecated': False,
    }
    return documentation

def convert_documentation_data(from_data: dict, to_data: dict):
    to_data['id'] = from_data['id']
    to_data['name'] = from_data['name']
    to_data['description'] = process_description(from_data.get('description'))
    to_data['examples'] = process_examples(from_data.get('examples'))
    to_data['since'] = process_since(from_data.get('since'))
    if 'patterns' in from_data:
        to_data['patterns'] = process_patterns(from_data['patterns'])
    if from_data.get('property') is not None:
        to_data['relatedProperty'] = {'id': from_data['property']['id'], 'name': from_data['property']['name']}
    if from_data.get('events') is not None:
        if isinstance(from_data['events'][0], str):
            to_data['events'] = [{'id': event.lower().replace(' ', '_'), 'name': event} for event in from_data['events']]
        else:
            to_data['events'] = from_data['events']

def create_type_data(data: dict):
    type_data = create_documentation()
    #type_id = 'Type' + data['id'][0].upper() + data['id'][1:]
    convert_documentation_data(data, type_data)
    if 'patterns' in type_data:
        if len(type_data['patterns']) > 0:
            type_data['usage'] = type_data['patterns']
        del type_data['patterns']
    type_data['codename'] = {
        'singular': data['id'],
        'plural': data['id'] + 's'
    }
    type_data['properties'] = []
    if 'properties' in data:
        for property_data in data['properties']:
            type_data['properties'].append({
                'property': {'id': property_data['id'], 'name': property_data['name']},
                'origin': {'name': property_data['provider']},
                'description': property_data['description'],
            })
    return type_data

def create_structure_data(data: dict):
    structure_data = create_documentation()
    convert_documentation_data(data, structure_data)
    structure_data['nodeType'] = 'SECTION' # TODO not exactly true
    return structure_data

def create_event_data(data: dict):
    event_data = create_documentation()
    convert_documentation_data(data, event_data)
    if 'cancellable' in data:
        event_data['cancellable'] = data['cancellable']
    event_data['eventValues'] = []
    return event_data

def create_section_data(data: dict):
    section_data = create_documentation()
    convert_documentation_data(data, section_data)
    return section_data

def create_effect_data(data: dict):
    effect_data = create_documentation()
    convert_documentation_data(data, effect_data)
    return effect_data

def create_condition_data(data: dict):
    condition_data = create_documentation()
    convert_documentation_data(data, condition_data)
    return condition_data

def create_expression_data(data: dict):
    expression_data = create_documentation()
    convert_documentation_data(data, expression_data)
    if 'returns' in data:
        expression_data['returnType'] = data['returns']
        if expression_data['returnType']['name'] == '':
            expression_data['returnType']['name'] = expression_data['returnType']['id']
    else:
        expression_data['returnType'] = {'id': 'object', 'name': 'Unknown'}
    return expression_data

def create_function_data(data: dict):
    function_data = create_documentation()
    convert_documentation_data(data, function_data)
    if 'returns' in data:
        function_data['returnType'] = data['returns']
        if function_data['returnType']['name'] == '':
            function_data['returnType']['name'] = function_data['returnType']['id']
    else:
        function_data['returnType'] = {'id': 'object', 'name': 'Unknown'}
    raw_params = function_data['patterns'][0]
    del function_data['patterns'][0]
    raw_params = raw_params[raw_params.index('(')+1:-1].split(', ')
    params = {}
    for raw_param in raw_params:
        name, ptype = raw_param.split(': ')
        default_value_index = ptype.find(' = ')
        optional = default_value_index != -1
        if optional:
            ptype = ptype[:default_value_index]
        plural = ptype.endswith('s')
        if plural:
            ptype = ptype[:-1]
        params[name] = {'name': name, 'type': {'id': ptype, 'name': ptype}, 'plural': plural, 'modifiers': {'optional': optional}}
    function_data['parameters'] = params
    return function_data

def create_property_data(data: dict):
    property_data = create_documentation()
    convert_documentation_data(data, property_data)
    property_data['types'] = data['relatedTypes'] if data['relatedTypes'] is not None else []
    property_data['syntaxes'] = data['relatedSyntaxes'] if data['relatedSyntaxes'] is not None else []
    return property_data

def create_experiment_data(data: dict):
    experiment_data = create_documentation()
    convert_documentation_data(data, experiment_data)
    experiment_data['phase'] = data['phase'].upper()
    experiment_data['pattern'] = data['pattern']
    return experiment_data

if __name__ == '__main__':
    inputs = Path('inputs')
    outputs = Path('outputs')

    for input_path in inputs.glob('*.json'):
        print("Processing", input_path.name)
        with open(input_path, 'r', encoding='utf-8') as input_file:
            old_data = json.load(input_file)
        new_data = convert_docs(old_data)
        with open(outputs / input_path.name, 'w', encoding='utf-8') as output_file:
            json.dump(new_data, output_file, indent=2, ensure_ascii=False)
            output_file.write('\n')
