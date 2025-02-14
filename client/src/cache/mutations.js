import { gql } from '@apollo/client'

export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      email
      _id
      firstName
      lastName
      password
      initials
    }
  }
`

export const REGISTER = gql`
  mutation Register(
    $email: String!
    $password: String!
    $firstName: String!
    $lastName: String!
  ) {
    register(
      email: $email
      password: $password
      firstName: $firstName
      lastName: $lastName
    ) {
      email
      password
      firstName
      lastName
    }
  }
`
export const LOGOUT = gql`
  mutation Logout {
    logout
  }
`

export const ADD_ITEM = gql`
  mutation AddItem($item: ItemInput!, $_id: String!) {
    addItem(item: $item, _id: $_id)
  }
`

export const DELETE_ITEM = gql`
  mutation DeleteItem($itemId: String!, $_id: String!) {
    deleteItem(itemId: $itemId, _id: $_id) {
      _id
      id
      description
      due_date
      assigned_to
      completed
    }
  }
`

export const UPDATE_ITEM_FIELD = gql`
  mutation UpdateItemField(
    $_id: String!
    $itemId: String!
    $field: String!
    $value: String!
    $flag: Int!
  ) {
    updateItemField(
      _id: $_id
      itemId: $itemId
      field: $field
      value: $value
      flag: $flag
    ) {
      _id
      id
      description
      due_date
      assigned_to
      completed
    }
  }
`

export const REORDER_ITEMS = gql`
  mutation ReorderItems($_id: String!, $itemId: String!, $direction: Int!) {
    reorderItems(_id: $_id, itemId: $itemId, direction: $direction) {
      _id
      id
      description
      due_date
      assigned_to
      completed
    }
  }
`

export const SORT_TASKS = gql`
  mutation SortTasks($_id: String!, $sortTasksFlag: Int!) {
    sortTasks(_id: $_id, sortTasksFlag: $sortTasksFlag) {
      _id
    }
  }
`

export const SORT_DUE_DATES = gql`
  mutation SortDueDates($_id: String!, $sortDueDatesFlag: Int!) {
    sortDueDates(_id: $_id, sortDueDatesFlag: $sortDueDatesFlag) {
      _id
    }
  }
`

export const SORT_STATUS = gql`
  mutation SortStatus($_id: String!, $sortStatusFlag: Int!) {
    sortStatus(_id: $_id, sortStatusFlag: $sortStatusFlag) {
      _id
    }
  }
`

export const SORT_ASSIGNED = gql`
  mutation SortAssigned($_id: String!, $sortAssignedFlag: Int!) {
    sortAssigned(_id: $_id, sortAssignedFlag: $sortAssignedFlag) {
      _id
    }
  }
`

export const RESTORE_ORIGINAL_LIST = gql`
  mutation restoreOriginalList($_id: String!, $orderedItems: [String]!) {
    restoreOriginalList(_id: $_id, orderedItems: $orderedItems) {
      _id
    }
  }
`

export const ADD_TODOLIST = gql`
  mutation AddTodolist($todolist: TodoInput!) {
    addTodolist(todolist: $todolist)
  }
`

export const DELETE_TODOLIST = gql`
  mutation DeleteTodolist($_id: String!) {
    deleteTodolist(_id: $_id)
  }
`

export const UPDATE_TODOLIST_FIELD = gql`
  mutation UpdateTodolistField(
    $_id: String!
    $field: String!
    $value: String!
  ) {
    updateTodolistField(_id: $_id, field: $field, value: $value)
  }
`

export const UPDATE_LIST = gql`
  mutation UpdateList($_id: String!, $prevList: [ItemInput]!) {
    updateList(_id: $_id, prevList: $prevList)
  }
`
