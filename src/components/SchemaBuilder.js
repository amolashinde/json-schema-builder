import React, { useState } from 'react';
import { Input, Select, Switch, Button, Card } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

const fieldTypes = ['string', 'number', 'boolean', 'nested'];

const SchemaBuilder = ({ onChange }) => {
  const [schema, setSchema] = useState([]);

  const handleChange = (index, key, value) => {
    const newSchema = [...schema];
    newSchema[index][key] = value;
    setSchema(newSchema);
  };

  const addField = () => {
    setSchema([...schema, { name: '', type: 'string', required: false, children: [] }]);
  };

  const removeField = (index) => {
    const newSchema = [...schema];
    newSchema.splice(index, 1);
    setSchema(newSchema);
  };

  const renderFields = (fields, depth = 0) => (
    fields.map((field, index) => (
      <div key={index} style={{ marginLeft: depth * 20, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
        <Input
          placeholder="name"
          value={field.name}
          onChange={(e) => handleChange(index, 'name', e.target.value)}
          style={{ width: 120 }}
        />
        <Select
          value={field.type}
          onChange={(value) => handleChange(index, 'type', value)}
          style={{ width: 120 }}
        >
          {fieldTypes.map(type => <Select.Option key={type} value={type}>{type}</Select.Option>)}
        </Select>
        <Switch
          checked={field.required}
          onChange={(checked) => handleChange(index, 'required', checked)}
        />
        <MinusCircleOutlined onClick={() => removeField(index)} />
        {field.type === 'nested' && (
          <div style={{ flexDirection: 'column' }}>
            {renderFields(field.children, depth + 1)}
            <Button
              type="dashed"
              size="small"
              onClick={() => {
                const newSchema = [...schema];
                newSchema[index].children.push({ name: '', type: 'string', required: false, children: [] });
                setSchema(newSchema);
              }}
              icon={<PlusOutlined />}
            >
              Add Item
            </Button>
          </div>
        )}
      </div>
    ))
  );

  const schemaJson = (fields) => {
    const result = {};
    fields.forEach(field => {
      if (field.type === 'nested') {
        result[field.name] = schemaJson(field.children);
      } else {
        result[field.name] = field.type.toUpperCase();
      }
    });
    return result;
  };

  return (
    <div style={{ display: 'flex', gap: 20 }}>
      <Card style={{ flex: 1 }}>
        {renderFields(schema)}
        <Button
          type="primary"
          onClick={addField}
          style={{ marginTop: 12 }}
          icon={<PlusOutlined />}
        >
          Add Item
        </Button>
      </Card>
      <Card style={{ width: '40%', background: '#f7f7f7' }}>
        <pre>{JSON.stringify(schemaJson(schema), null, 2)}</pre>
      </Card>
    </div>
  );
};

export default SchemaBuilder;
