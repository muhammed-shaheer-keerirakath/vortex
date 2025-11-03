import React, { useState } from 'react'
import GitStatus from './components/gitStatus'
import AIStatus from './components/aiStatus'
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { StatusBar } from 'apps/remix-ide/src/app/components/status-bar'
import { StatusBarContextProvider } from '../contexts/statusbarcontext'
import DidYouKnow from './components/didYouKnow'

export interface RemixUIStatusBarProps {
  statusBarPlugin: StatusBar
}

export function RemixUIStatusBar({ statusBarPlugin }: RemixUIStatusBarProps) {
  const [gitBranchName, setGitBranchName] = useState('')
  const [isAiActive, setIsAiActive] = useState(false)

  const lightAiUp = async () => {
    const aiActive = await statusBarPlugin.call('settings', 'get', 'settings/copilot/suggest/activate')
    if (!aiActive) return
    setIsAiActive(aiActive)
    return aiActive
  }

  return (
    <>
      <StatusBarContextProvider>
        <div className="d-flex remixui_statusbar_height flex-row bg-info justify-content-between align-items-center">
          <div className="d-flex w-100 justify-content-between">
            <div className="remixui_statusbar remixui_statusbar_gitstatus">
              <GitStatus plugin={statusBarPlugin} gitBranchName={gitBranchName} setGitBranchName={setGitBranchName} />
            </div>
          </div>
          <div className="w-100 remixui_statusbar">
            <DidYouKnow />
          </div>
          <div className="remixui_statusbar d-flex w-100 justify-content-end p-0">
            <div className="remixui_statusbar">
              <AIStatus plugin={statusBarPlugin} aiActive={lightAiUp} isAiActive={isAiActive} setIsAiActive={setIsAiActive} />
            </div>
          </div>
        </div>
      </StatusBarContextProvider>
    </>
  )
}
