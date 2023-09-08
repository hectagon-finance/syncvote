import { Modal } from 'antd';
import { L } from '@utils/locales/L';
import { deleteAWorkflow } from '@dal/data';
import { useDispatch } from 'react-redux';
import { useSetData } from '@dal/dal';
import { config } from '@dal/config';

interface DeleteWorkflowModalProps {
  open: boolean;
  onClose: () => void;
  workflow: any;
}

const DeleteWorkflowModal: React.FC<DeleteWorkflowModalProps> = ({
  open,
  onClose,
  workflow,
}) => {
  const dispatch = useDispatch();
  const handleCancel = () => {
    onClose();
  };

  const handleOk = async () => {
    
    await useSetData({
      params: { workflow },
      dispatch: dispatch,
      configInfo: config.deleteAWorkflow,
    });

    onClose();
  };

  return (
    <Modal
      title={`Delete "${workflow.title}"`}
      onOk={handleOk}
      open={open}
      onCancel={handleCancel}
      okText={L('deleteForever')}
      okButtonProps={{ style: { backgroundColor: '#A22C29' } }}
      cancelButtonProps={{ style: { display: 'none' } }}
    >
      <div>
        <p>
          Are you sure you want to delete this workflow? This action cannot be
          undone and all associated data will be permanently removed from the
          system.
        </p>
      </div>
    </Modal>
  );
};

export default DeleteWorkflowModal;
