import React, { useState, useEffect } from 'react'
import Logo from '../navbar/Logo'
import NavbarOptions from '../navbar/NavbarOptions'
import MainContents from '../main/MainContents'
import SidebarContents from '../sidebar/SidebarContents'
import Login from '../modals/Login'
import Delete from '../modals/Delete'
import CreateAccount from '../modals/CreateAccount'
import { GET_DB_TODOS } from '../../cache/queries'
import * as mutations from '../../cache/mutations'
import { useMutation, useQuery } from '@apollo/client'
import { WNavbar, WSidebar, WNavItem } from 'wt-frontend'
import { WLayout, WLHeader, WLMain, WLSide } from 'wt-frontend'
import {
  UpdateListField_Transaction,
  UpdateListItems_Transaction,
  ReorderItems_Transaction,
  EditItem_Transaction,
  SortTasks_Transaction,
  SortDueDates_Transaction,
  SortStatus_Transaction,
  SortAssigned_Transaction,
} from '../../utils/jsTPS'
import WInput from 'wt-frontend/build/components/winput/WInput'

const Homescreen = (props) => {
  let todolists = []
  const [activeList, setActiveList] = useState({})
  const [showDelete, toggleShowDelete] = useState(false)
  const [showLogin, toggleShowLogin] = useState(false)
  const [showCreate, toggleShowCreate] = useState(false)

  const [sortTasksFlag, setSortTasksFlag] = useState(0)
  const [sortDueDatesFlag, setSortDueDatesFlag] = useState(0)
  const [sortStatusFlag, setSortStatusFlag] = useState(0)
  const [sortAssignedFlag, setSortAssignedFlag] = useState(0)

  const [ReorderTodoItems] = useMutation(mutations.REORDER_ITEMS)
  const [UpdateTodoItemField] = useMutation(mutations.UPDATE_ITEM_FIELD)
  const [UpdateTodolistField] = useMutation(mutations.UPDATE_TODOLIST_FIELD)
  const [DeleteTodolist] = useMutation(mutations.DELETE_TODOLIST)
  const [DeleteTodoItem] = useMutation(mutations.DELETE_ITEM)
  const [AddTodolist] = useMutation(mutations.ADD_TODOLIST)
  const [AddTodoItem] = useMutation(mutations.ADD_ITEM)
  const [SortTasks] = useMutation(mutations.SORT_TASKS)
  const [SortDueDates] = useMutation(mutations.SORT_DUE_DATES)
  const [SortStatus] = useMutation(mutations.SORT_STATUS)
  const [SortAssigned] = useMutation(mutations.SORT_ASSIGNED)
  const [UpdateList] = useMutation(mutations.UPDATE_LIST)

  const { loading, error, data, refetch } = useQuery(GET_DB_TODOS)
  if (loading) {
    console.log(loading, 'loading')
  }
  if (error) {
    console.log(error, 'error')
  }
  if (data) {
    todolists = data.getAllTodos
  }

  const auth = props.user === null ? false : true

  const refetchTodos = async (refetch) => {
    const { loading, error, data } = await refetch()
    if (data) {
      todolists = data.getAllTodos
      if (activeList._id) {
        let tempID = activeList._id
        let list = todolists.find((list) => list._id === tempID)
        setActiveList(list)
      }
      console.log(data.getAllTodos)
    }
  }

  const tpsUndo = async () => {
    const retVal = await props.tps.undoTransaction()
    refetchTodos(refetch)
    return retVal
  }

  const tpsRedo = async () => {
    const retVal = await props.tps.doTransaction()
    refetchTodos(refetch)
    return retVal
  }

  const updateSortingFlags = async () => {
    setSortTasksFlag(0)
    setSortDueDatesFlag(0)
    setSortStatusFlag(0)
    setSortAssignedFlag(0)
  }

  // Creates a default item and passes it to the backend resolver.
  // The return id is assigned to the item, and the item is appended
  //  to the local cache copy of the active todolist.
  const addItem = async () => {
    let list = activeList
    const items = list.items
    let lastID = 0
    if (items.length >= 1) {
      for (let i = 0; i < items.length; i++) {
        const element = items[i]
        if (element.id == lastID) {
          lastID = element.id + 1
        }
      }
    }

    const newItem = {
      _id: '',
      id: lastID,
      description: 'No Description',
      due_date: 'No Date',
      assigned_to: 'Not Assigned',
      completed: false,
    }
    let opcode = 1
    let itemID = newItem._id
    let listID = activeList._id
    let transaction = new UpdateListItems_Transaction(
      listID,
      itemID,
      newItem,
      opcode,
      AddTodoItem,
      DeleteTodoItem
    )
    props.tps.addTransaction(transaction)
    tpsRedo()
    updateSortingFlags()
  }

  const deleteItem = async (item) => {
    let listID = activeList._id
    let itemID = item._id
    let opcode = 0
    let itemToDelete = {
      _id: item._id,
      id: item.id,
      description: item.description,
      due_date: item.due_date,
      assigned_to: item.assigned_to,
      completed: item.completed,
    }
    let transaction = new UpdateListItems_Transaction(
      listID,
      itemID,
      itemToDelete,
      opcode,
      AddTodoItem,
      DeleteTodoItem
    )
    props.tps.addTransaction(transaction)
    tpsRedo()
    updateSortingFlags()
  }

  const editItem = async (itemID, field, value, prev) => {
    let flag = 0
    if (field === 'completed') flag = 1
    let listID = activeList._id
    let transaction = new EditItem_Transaction(
      listID,
      itemID,
      field,
      prev,
      value,
      flag,
      UpdateTodoItemField
    )
    props.tps.addTransaction(transaction)
    tpsRedo()
  }

  const reorderItem = async (itemID, dir) => {
    let listID = activeList._id
    let transaction = new ReorderItems_Transaction(
      listID,
      itemID,
      dir,
      ReorderTodoItems
    )
    props.tps.addTransaction(transaction)
    tpsRedo()
    updateSortingFlags()
  }

  const createNewList = async () => {
    const length = todolists.length
    const id =
      length >= 1
        ? todolists[length - 1].id + Math.floor(Math.random() * 100 + 1)
        : 1
    let list = {
      _id: '',
      id: id,
      name: 'Untitled',
      owner: props.user._id,
      items: [],
    }
    const { data } = await AddTodolist({
      variables: { todolist: list },
      refetchQueries: [{ query: GET_DB_TODOS }],
    })
    setActiveList(list)
    updateSortingFlags()
  }

  const deleteList = async (_id) => {
    DeleteTodolist({
      variables: { _id: _id },
      refetchQueries: [{ query: GET_DB_TODOS }],
    })
    refetch()
    setActiveList({})
    updateSortingFlags()
  }

  const updateListField = async (_id, field, value, prev) => {
    let transaction = new UpdateListField_Transaction(
      _id,
      field,
      prev,
      value,
      UpdateTodolistField
    )
    props.tps.addTransaction(transaction)
    tpsRedo()
    updateSortingFlags()
  }

  const sortTasks = async (_id) => {
    let transaction = new SortTasks_Transaction(
      _id,
      SortTasks,
      sortTasksFlag,
      setSortTasksFlag,
      activeList,
      UpdateTodolistField
    )
    props.tps.addTransaction(transaction)
    tpsRedo()
  }

  const sortDueDates = async (_id) => {
    let transaction = new SortDueDates_Transaction(
      _id,
      SortDueDates,
      sortDueDatesFlag,
      setSortDueDatesFlag,
      activeList,
      UpdateTodolistField
    )
    props.tps.addTransaction(transaction)
    tpsRedo()
  }

  const sortStatus = async (_id) => {
    let transaction = new SortStatus_Transaction(
      _id,
      SortStatus,
      sortStatusFlag,
      setSortStatusFlag,
      activeList,
      UpdateTodolistField
    )
    props.tps.addTransaction(transaction)
    tpsRedo()
  }

  const sortAssigned = async (_id) => {
    let transaction = new SortAssigned_Transaction(
      _id,
      SortAssigned,
      sortAssignedFlag,
      setSortAssignedFlag,
      activeList,
      UpdateTodolistField
    )
    props.tps.addTransaction(transaction)
    tpsRedo()
  }

  const handleSetActive = (id) => {
    const todo = todolists.find((todo) => todo.id === id || todo._id === id)
    setActiveList(todo)
  }

  /*
		Since we only have 3 modals, this sort of hardcoding isnt an issue, if there
		were more it would probably make sense to make a general modal component, and
		a modal manager that handles which to show.
	*/
  const setShowLogin = () => {
    toggleShowDelete(false)
    toggleShowCreate(false)
    toggleShowLogin(!showLogin)
  }

  const setShowCreate = () => {
    toggleShowDelete(false)
    toggleShowLogin(false)
    toggleShowCreate(!showCreate)
  }

  const setShowDelete = () => {
    toggleShowCreate(false)
    toggleShowLogin(false)
    toggleShowDelete(!showDelete)
  }

  return (
    <WLayout wLayout='header-lside'>
      <WLHeader>
        <WNavbar color='colored'>
          <ul>
            <WNavItem>
              <Logo className='logo' />
            </WNavItem>
          </ul>
          <ul>
            <NavbarOptions
              fetchUser={props.fetchUser}
              auth={auth}
              setShowCreate={setShowCreate}
              setShowLogin={setShowLogin}
              refetchTodos={refetch}
              setActiveList={setActiveList}
            />
          </ul>
        </WNavbar>
      </WLHeader>

      <WLSide side='left'>
        <WSidebar>
          {activeList ? (
            <SidebarContents
              todolists={todolists}
              activeid={activeList.id}
              auth={auth}
              handleSetActive={handleSetActive}
              createNewList={createNewList}
              undo={tpsUndo}
              redo={tpsRedo}
              updateListField={updateListField}
              tps={props.tps}
            />
          ) : (
            <></>
          )}
        </WSidebar>
      </WLSide>
      <WLMain>
        {activeList ? (
          <div className='container-secondary'>
            <MainContents
              addItem={addItem}
              deleteItem={deleteItem}
              editItem={editItem}
              reorderItem={reorderItem}
              setShowDelete={setShowDelete}
              activeList={activeList}
              setActiveList={setActiveList}
              sortTasks={sortTasks}
              sortDueDates={sortDueDates}
              sortStatus={sortStatus}
              sortAssigned={sortAssigned}
              undo={tpsUndo}
              redo={tpsRedo}
              tps={props.tps}
            />
          </div>
        ) : (
          <div className='container-secondary' />
        )}
      </WLMain>

      {showDelete && (
        <Delete
          deleteList={deleteList}
          activeid={activeList._id}
          setShowDelete={setShowDelete}
        />
      )}

      {showCreate && (
        <CreateAccount
          fetchUser={props.fetchUser}
          setShowCreate={setShowCreate}
        />
      )}

      {showLogin && (
        <Login
          fetchUser={props.fetchUser}
          refetchTodos={refetch}
          setShowLogin={setShowLogin}
        />
      )}
    </WLayout>
  )
}

export default Homescreen
