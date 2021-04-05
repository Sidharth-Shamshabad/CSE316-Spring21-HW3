const ObjectId = require('mongoose').Types.ObjectId
const Todolist = require('../models/todolist-model')

// The underscore param, "_", is a wildcard that can represent any value;
// here it is a stand-in for the parent parameter, which can be read about in
// the Apollo Server documentation regarding resolvers

module.exports = {
  Query: {
    /** 
		 	@param 	 {object} req - the request object containing a user id
			@returns {array} an array of todolist objects on success, and an empty array on failure
		**/
    getAllTodos: async (_, __, { req }) => {
      const _id = new ObjectId(req.userId)
      if (!_id) {
        return []
      }
      const todolists = await Todolist.find({ owner: _id })
      if (todolists) return todolists
    },
    /** 
		 	@param 	 {object} args - a todolist id
			@returns {object} a todolist on success and an empty object on failure
		**/
    getTodoById: async (_, args) => {
      const { _id } = args
      const objectId = new ObjectId(_id)
      const todolist = await Todolist.findOne({ _id: objectId })
      if (todolist) return todolist
      else return {}
    },
  },
  Mutation: {
    /** 
		 	@param 	 {object} args - a todolist id and an empty item object
			@returns {string} the objectID of the item or an error message
		**/
    addItem: async (_, args) => {
      const { _id, item } = args
      const listId = new ObjectId(_id)
      const objectId = new ObjectId()
      const found = await Todolist.findOne({ _id: listId })
      if (!found) return 'Todolist not found'
      if (item._id === '') item._id = objectId
      let listItems = found.items
      listItems.push(item)

      const updated = await Todolist.updateOne(
        { _id: listId },
        { items: listItems }
      )

      if (updated) return item._id
      else return 'Could not add item'
    },
    /** 
		 	@param 	 {object} args - an empty todolist object
			@returns {string} the objectID of the todolist or an error message
		**/
    addTodolist: async (_, args) => {
      const { todolist } = args
      const objectId = new ObjectId()
      const { id, name, owner, items } = todolist
      const newList = new Todolist({
        _id: objectId,
        id: id,
        name: name,
        owner: owner,
        items: items,
      })
      const updated = newList.save()
      if (updated) return objectId
      else return 'Could not add todolist'
    },
    /** 
		 	@param 	 {object} args - a todolist objectID and item objectID
			@returns {array} the updated item array on success or the initial 
							 array on failure
		**/
    deleteItem: async (_, args) => {
      const { _id, itemId } = args
      const listId = new ObjectId(_id)
      const found = await Todolist.findOne({ _id: listId })
      let listItems = found.items
      listItems = listItems.filter((item) => item._id.toString() !== itemId)
      const updated = await Todolist.updateOne(
        { _id: listId },
        { items: listItems }
      )
      if (updated) return listItems
      else return found.items
    },
    /** 
		 	@param 	 {object} args - a todolist objectID 
			@returns {boolean} true on successful delete, false on failure
		**/
    deleteTodolist: async (_, args) => {
      const { _id } = args
      const objectId = new ObjectId(_id)
      const deleted = await Todolist.deleteOne({ _id: objectId })
      if (deleted) return true
      else return false
    },
    /** 
		 	@param 	 {object} args - a todolist objectID, field, and the update value
			@returns {boolean} true on successful update, false on failure
		**/
    updateTodolistField: async (_, args) => {
      const { field, value, _id } = args
      const objectId = new ObjectId(_id)

      console.log(field, value)
      const updated = await Todolist.updateOne(
        { _id: objectId },
        { [field]: value }
      )
      if (updated) return value
      else return ''
    },
    /** 
			@param	 {object} args - a todolist objectID, an item objectID, field, and
									 update value. Flag is used to interpret the completed 
									 field,as it uses a boolean instead of a string
			@returns {array} the updated item array on success, or the initial item array on failure
		**/
    updateItemField: async (_, args) => {
      const { _id, itemId, field, flag } = args
      let { value } = args
      const listId = new ObjectId(_id)
      const found = await Todolist.findOne({ _id: listId })
      let listItems = found.items
      if (flag === 1) {
        if (value === 'complete') {
          value = true
        }
        if (value === 'incomplete') {
          value = false
        }
      }
      listItems.map((item) => {
        if (item._id.toString() === itemId) {
          item[field] = value
        }
      })
      const updated = await Todolist.updateOne(
        { _id: listId },
        { items: listItems }
      )
      if (updated) return listItems
      else return found.items
    },
    /**
			@param 	 {object} args - contains list id, item to swap, and swap direction
			@returns {array} the reordered item array on success, or initial ordering on failure
		**/
    reorderItems: async (_, args) => {
      const { _id, itemId, direction } = args
      const listId = new ObjectId(_id)
      const found = await Todolist.findOne({ _id: listId })
      let listItems = found.items
      const index = listItems.findIndex(
        (item) => item._id.toString() === itemId
      )
      // move selected item visually down the list
      if (direction === 1 && index < listItems.length - 1) {
        let next = listItems[index + 1]
        let current = listItems[index]
        listItems[index + 1] = current
        listItems[index] = next
      }
      // move selected item visually up the list
      else if (direction === -1 && index > 0) {
        let prev = listItems[index - 1]
        let current = listItems[index]
        listItems[index - 1] = current
        listItems[index] = prev
      }
      const updated = await Todolist.updateOne(
        { _id: listId },
        { items: listItems }
      )
      if (updated) return listItems
      // return old ordering if reorder was unsuccessful
      listItems = found.items
      return found.items
    },
    sortTasks: async (_, args) => {
      console.log(Todolist.countDocuments())
      const { _id, sortTasksFlag } = args
      const listId = new ObjectId(_id)
      const found = await Todolist.findOne({ _id: listId })
      let oldItems = found.items
      let listItems = found.items
      if (sortTasksFlag === 0) {
        let newListItems = listItems.sort((a, b) => {
          let descriptionA = a.description.toLowerCase()
          let descriptionB = b.description.toLowerCase()
          if (descriptionA < descriptionB) return -1
          if (descriptionA > descriptionB) return 1
          return 0
        })
        listItems = newListItems
      } else {
        let newListItems = listItems.reverse()
        listItems = newListItems
      }

      const updated = await Todolist.updateOne(
        { _id: listId },
        { items: listItems }
      )

      if (updated) return listItems
      return found.items
    },
    sortDueDates: async (_, args) => {
      const { _id, sortDueDatesFlag } = args
      const listId = new ObjectId(_id)
      const found = await Todolist.findOne({ _id: listId })
      let oldItems = found.items
      let listItems = found.items
      console.log(listItems)
      if (sortDueDatesFlag === 0) {
        let newListItems = listItems.sort((a, b) => {
          let due_dateA = a.due_date.toLowerCase()
          let due_dateB = b.due_date.toLowerCase()
          if (due_dateA < due_dateB) return -1
          if (due_dateA > due_dateB) return 1
          return 0
        })
        listItems = newListItems
      } else {
        let newListItems = listItems.sort((a, b) => {
          let due_dateA = a.due_date.toLowerCase()
          let due_dateB = b.due_date.toLowerCase()
          if (due_dateA < due_dateB) return -1
          if (due_dateA > due_dateB) return 1
          return 0
        })
        newListItems = listItems.reverse()
        listItems = newListItems
      }

      const updated = await Todolist.updateOne(
        { _id: listId },
        { items: listItems }
      )

      if (updated) return listItems
      return found.items
    },
    sortStatus: async (_, args) => {
      const { _id, sortStatusFlag } = args
      const listId = new ObjectId(_id)
      const found = await Todolist.findOne({ _id: listId })
      let oldItems = found.items
      let listItems = found.items
      if (sortStatusFlag === 0) {
        let newListItems = listItems.sort((a, b) => {
          let statusA = a.completed
          let statusB = b.completed
          if (statusA < statusB) return -1
          if (statusA > statusB) return 1
          return 0
        })
        listItems = newListItems
      } else {
        let newListItems = listItems.sort((a, b) => {
          let statusA = a.completed
          let statusB = b.completed
          if (statusA < statusB) return -1
          if (statusA > statusB) return 1
          return 0
        })
        newListItems = listItems.reverse()
        listItems = newListItems
      }

      const updated = await Todolist.updateOne(
        { _id: listId },
        { items: listItems }
      )

      if (updated) return listItems
      return found.items
    },
    sortAssigned: async (_, args) => {
      const { _id, sortAssignedFlag } = args
      const listId = new ObjectId(_id)
      const found = await Todolist.findOne({ _id: listId })
      let oldItems = found.items
      let listItems = found.items
      if (sortAssignedFlag === 0) {
        let newListItems = listItems.sort((a, b) => {
          let assignedA = a.assigned_to.toLowerCase()
          console.log(assignedA)
          let assignedB = b.assigned_to.toLowerCase()
          if (assignedA < assignedB) return -1
          if (assignedA > assignedB) return 1
          return 0
        })
        listItems = newListItems
      } else {
        let newListItems = listItems.sort((a, b) => {
          let assignedA = a.assigned_to.toLowerCase()
          let assignedB = b.assigned_to.toLowerCase()
          if (assignedA < assignedB) return -1
          if (assignedA > assignedB) return 1
          return 0
        })
        newListItems = listItems.reverse()
        listItems = newListItems
      }

      const updated = await Todolist.updateOne(
        { _id: listId },
        { items: listItems }
      )

      if (updated) return listItems
      return found.items
    },
    restoreOriginalList: async (_, args) => {
      const { _id, orderedItems } = args
      const listId = new ObjectId(_id)
      const found = await Todolist.findOne({ _id: listId })

      let originalList = []

      for (let i = 0; i < orderedItems.length; i++) {
        let id = orderedItems[i]
        for (let j = 0; j < found.items.length; j++) {
          let element = found.items[j]
          if (element._id == id) {
            originalList.push(element)
            break
          }
        }
      }
      const updated = await Todolist.updateOne(
        { _id: listId },
        { items: originalList }
      )

      console.log(originalList)

      if (updated) return originalList
      return found.items
    },
    // updateListOrder: async (_, args) => {
    //   const { _id } = args

    // },
    updateList: async (_, args) => {
      const { _id, prevList } = args
      const listId = new ObjectId(_id)
      const found = await Todolist.findOne({ _id: listId })

      const updated = await Todolist.updateOne(
        { _id: listId },
        { items: prevList }
      )

      if (updated) return listItems
      return found.items
    },
  },
}
