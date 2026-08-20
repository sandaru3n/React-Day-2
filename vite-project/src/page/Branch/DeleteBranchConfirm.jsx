import Btn from "../../components/ui/Btn";
import Modal from "../../components/ui/Modal";

export default function DeleteBranchConfirm({ name, onClose, onDelete, apiLoading }) {
  return (
    <Modal title="Delete Branch" onClose={onClose}>
      <div className="space-y-5">
        <p className="text-sm text-zinc-400">Are you sure you want to delete <span className="text-zinc-200 font-medium">{name}</span>? This action cannot be undone.</p>
        <div className="flex justify-end gap-2">
          <Btn variant="secondary" onClick={onClose}>Cancel</Btn>
          <Btn disabled={apiLoading} loading={apiLoading} variant="danger" onClick={onDelete}>Delete Branch</Btn>
        </div>
      </div>
    </Modal>
  )
}
