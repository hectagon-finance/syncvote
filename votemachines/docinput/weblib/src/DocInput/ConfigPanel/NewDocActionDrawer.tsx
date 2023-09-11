import { Modal, Space, Input, Select } from 'antd';
import { TextEditor } from 'rich-text-editor';
import { DocInput } from '../interface';
import { useState } from 'react';

const NewDocActionDrawer = ({
  open,
  onCancel,
  data,
  onChange,
}: {
  open: boolean;
  data: any;
  onCancel: () => void;
  onChange: (data: any) => void;
}) => {
  const [newDoc, setNewDoc] = useState<DocInput.IDoc>({
    id: '',
    action: DocInput.DocAction.NONE,
    description: '',
  });
  return (
    <Modal
      title='Add new Document action'
      open={open}
      onCancel={() => onCancel()}
      onOk={() => {
        if (newDoc.id === '') {
          Modal.error({
            content: 'id cannot be empty!',
          });
          return;
        }
        const toChange = {
          ...data,
          docs: [...data.docs, newDoc],
        };
        onChange({
          data: toChange,
        });
        setNewDoc({
          id: '',
          action: DocInput.DocAction.NONE,
          description: '',
        });
        onCancel();
      }}
    >
      <Space direction='vertical' className='w-full' size='middle'>
        <Input
          value={newDoc.id}
          placeholder='id of the document'
          className='w-full'
          onChange={(e: any) => {
            setNewDoc({ ...newDoc, id: e.target.value });
          }}
        />
        <Select
          options={[
            {
              value: DocInput.DocAction.UPSERT,
              label: 'Create new or edit this document',
            },
            {
              value: DocInput.DocAction.APPEND,
              label: 'Append to the end of this document',
            },
          ]}
          className='w-full'
          onChange={(value: DocInput.DocAction) => {
            setNewDoc({
              ...newDoc,
              action: value,
            });
          }}
        />
        <TextEditor
          value={newDoc.description}
          setValue={(val: string) => setNewDoc({ ...newDoc, description: val })}
        />
      </Space>
    </Modal>
  );
};

export default NewDocActionDrawer;
