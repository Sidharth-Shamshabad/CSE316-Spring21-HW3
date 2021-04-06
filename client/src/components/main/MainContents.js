import React from 'react'
import TableHeader from './TableHeader'
import TableContents from './TableContents'

const MainContents = (props) => {
  const closeList = () => {
    props.setActiveList({})
    props.tps.clearAllTransactions()
    props.updateTransactionFlags()
  }

  return (
    <div className='table '>
      <TableHeader
        disabled={!props.activeList._id}
        addItem={props.addItem}
        setShowDelete={props.setShowDelete}
        setActiveList={props.setActiveList}
        activeList={props.activeList}
        sortTasks={props.sortTasks}
        sortDueDates={props.sortDueDates}
        sortStatus={props.sortStatus}
        sortAssigned={props.sortAssigned}
        undo={props.undo}
        redo={props.redo}
        tps={props.tps}
        closeList={closeList}
        hasUndo={props.hasUndo}
        hasRedo={props.hasRedo}
      />
      <TableContents
        key={props.activeList.id}
        activeList={props.activeList}
        deleteItem={props.deleteItem}
        reorderItem={props.reorderItem}
        editItem={props.editItem}
        setIsEditing={props.setIsEditing}
      />
    </div>
  )
}

export default MainContents
