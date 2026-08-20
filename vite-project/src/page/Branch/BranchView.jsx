import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import EditBranchModal from "./EditBranchModal"
import Card from "../../components/ui/Card"
import StatusBadge from "../../components/ui/StatusBadge"
import Icons from "../../components/ui/Icons"
import Btn from "../../components/ui/Btn"
import { ClipLoader } from "react-spinners"
import { getBranch_API } from "../../services/branch.api"
import toast from "react-hot-toast"

export default function BranchView() {
  const { b_id } = useParams()
  const [branch, setBranch] = useState(null)
  const [editBranch, setEditBranch] = useState(null)
  const [fetchLoading, setFetchLoading] = useState(true)

  const handleGetBranch = async () => {
    try {
      setFetchLoading(true)
      const res = await getBranch_API(b_id)

      if (res?.data?.success) {
        setBranch(res?.data?.data || null)
      } else {
        setBranch(null)
        toast.error(res?.data?.message || "fetch failed")
      }
    } catch (error) {
      console.error(error)
      setBranch(null)
      toast.error('An unexpected error')
    } finally {
      setFetchLoading(false)
    }
  }

  useEffect(() => {
    handleGetBranch()
  }, [b_id])

  if (fetchLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <ClipLoader color="#6366f1" size={36} />
        <p className="text-sm text-zinc-500">Loading branch...</p>
      </div>
    )
  }

  if (!branch) {
    return (
      <div className="p-6 space-y-4">
        <Link to="/branches" className="text-zinc-600 hover:text-zinc-300 bg-white/4 rounded-lg p-2 transition inline-flex">
          {Icons.arrowLeft}
        </Link>
        <div className="text-zinc-500">Branch not found</div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-5">
      {editBranch && (
        <EditBranchModal
          branch={editBranch}
          branches={[branch]}
          setBranches={(list) => {
            const updated = list.find(x => x.id === branch.id)
            if (updated) setBranch(updated)
          }}
          onClose={() => setEditBranch(null)}
        />
      )}
      <div className="flex items-center gap-3">
        <Link to="/branches" className="text-zinc-600 hover:text-zinc-300 bg-white/4 rounded-lg p-2 transition">
          {Icons.arrowLeft}
        </Link>
        <div>
          <h1 className="text-xl font-semibold text-zinc-100">Branch Profile</h1>
          <p className="text-sm text-zinc-500 mt-0.5">{branch.city}</p>
        </div>
      </div>

      <Card className="p-5 space-y-5">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-zinc-100">{branch.name}</h2>
            <div className="text-sm text-zinc-500">{branch.manager}</div>
            <div className="flex items-center gap-2 mt-1.5">
              <StatusBadge status={branch.status} />
            </div>
          </div>
          <Btn variant="secondary" size="sm" onClick={() => setEditBranch(branch)}>{Icons.edit} Edit</Btn>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/5">
          {[
            { label: 'Branch ID', value: branch.id },
            { label: 'City', value: branch.city },
            { label: 'Manager', value: branch.manager },
            { label: 'Status', value: branch.status },
            { label: 'Students', value: branch.studentCount },
            { label: 'Active Students', value: branch.activeCount },
          ].map(f => (
            <div key={f.label}>
              <div className="text-[10px] text-zinc-600 uppercase tracking-wider mb-0.5">{f.label}</div>
              <div className="text-sm text-zinc-300">{f.value ?? '—'}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
