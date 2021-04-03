import React from 'react'
import SidebarHeader from './SidebarHeader'
import SidebarList from './SidebarList'

const SidebarContents = (props) => {
  return (
    <>
      <SidebarHeader
        auth={props.auth}
        createNewList={props.createNewList}
        undo={props.undo}
        redo={props.redo}
        isEditing={props.isEditing}
      />
      <SidebarList
        activeid={props.activeid}
        handleSetActive={props.handleSetActive}
        todolists={props.todolists}
        createNewList={props.createNewList}
        updateListField={props.updateListField}
        tps={props.tps}
        setIsEditing={props.setIsEditing}
      />
    </>
  )
}

export default SidebarContents
