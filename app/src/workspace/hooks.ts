import { useContext } from 'react'
import { WorkspaceContext } from '~/workspace/WorkspaceContext'

export const useWorkspace = () => useContext(WorkspaceContext)
