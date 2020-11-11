// 1. Storage Controller
const storageCtrl = (function () {

    // public methods
    return {
        storeItem: function (item){
            let items;
            // check if any items present in local storage
            if(localStorage.getItem('items')===null){
                items = [];
                //push new item
                items.push(item);
                //store items in local storage
                localStorage.setItem('items', JSON.stringify(items));
            }else{
                // if local storage not empty get what is already in local storage
                items = JSON.parse(localStorage.getItem('items'));
                // push new item
                items.push(item);

                //store items in local storage
                localStorage.setItem('items', JSON.stringify(items));
            }
            JSON.stringify(localStorage.getItem('items'));
        },
        getItemsFromStorage: function (){
            let items;
            if(localStorage.getItem('items')=== null){
                items = [];
            }else{
                items = JSON.parse(localStorage.getItem('items'));
            }
            return items;
        },
        updateItemStorage: function (updatedItem){
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach(function (item, index){
                if(updatedItem.id === item.id){
                    items.splice(index, 1, updatedItem);
                }
            });
            localStorage.setItem('items', JSON.stringify(items));
        },
        deleteItemFromStorage: function (id) {
            let items = JSON.parse(localStorage.getItem('items'));
            items.forEach(function (item, index){
                if(id === item.id){
                    items.splice(index, 1);
                }
            });
            localStorage.setItem('items', JSON.stringify(items));
        },
        clearItemsFromStorage: function () {
            localStorage.removeItem('items');
        }
    }
})();

// 2. Item Controller ###########################################################
const itemCtrl = (function (){

    // Item constructor
    const Item = function (id, name, calories){
        this.id = id;
        this.name = name;
        this.calories = calories;
    }
    // Data Structure / State
    const data = {
        items: storageCtrl.getItemsFromStorage(),
        currentItem: null,
        totalCalories: 0
    }

    // public methods
    return {
        getItems: function(){
            return data.items;
        },
        addItem: function(name, calories){
            let ID;
            // create item ID
            if(data.items.length > 0){
                ID = data.items[data.items.length-1].id +1;
            }else {
                ID = 0;
            }
            // calories to number
            calories = parseInt(calories);
            // create new item
            let newItem = new Item(ID, name, calories);
            // add to items array
            data.items.push(newItem);

            return newItem;
        },
        getItemById: function(id){
            let found = null;
            data.items.forEach(function (item) {
                if(item.id === id){
                    found = item;
                }
            });
            return found;
        },
        updateItem: function(name, calories){
            // turn calories to number
            calories = parseInt(calories);
            let found = null;

            data.items.forEach(function (item){
                if(item.id === data.currentItem.id){
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            });
            return found;
        },
        deleteItem: function(id){

            // get ids
            const ids = data.items.map(function (item) {

                return item.id;
            });

            //get index
            const index = ids.indexOf(id);
            //remove item
            data.items.splice(index, 1);
        },
        clearAllItems: function(){
            data.items = [];
        },
        setCurrentItem: function(item){
            data.currentItem = item;
        },
        getCurrentItem: function(){
            return data.currentItem;
        },
        getTotalcalories: function (){
            let total = 0;
            // loop through items and add cals
            data.items.forEach(function (item) {
                total += item.calories;
            });
            // set total cal in data structure
            data.totalCalories = total;
            // return total calories;
            return data.totalCalories;
        },
        logData: function () {
            return data;
        }
    }
})();

// 3. UI Controller##################################################################
const uiCtrl = (function (){
    const UISelectors = {
        itemList: '#item-list',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCalories: '.total-calories',
        listItems: '#item-list li',
        clearBtn: '.clear-btn'
    }
    //public method
    return {
        populateItemList: function (items) {
            let html =  '';
            items.forEach(function (item) {
               html += `<li class="collection-item" id="item-${item.id}">
                        <strong>${item.name}:</strong> <em>${item.calories} Calories</em>
                        <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
                        </li>`;
            });
            // Insert list items
            document.querySelector(UISelectors.itemList).innerHTML = html;
        },
        getItemInput: function(){
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },
        addListItem: function (item){
            // show the list
            document.querySelector(UISelectors.itemList).style.display = 'block';

            // create li element
            const li = document.createElement('li');
            li.className = 'collection-item';
            li.id = `item-${item.id}`;
            //add html
            li.innerHTML = `<strong>${item.name}:</strong> <em>${item.calories} Calories</em>
                            <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>`;
            //insert the li element
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
        },
        updateListItem: function (item){
            // first we take a node list with the querySelectorAll
            let listItems = document.querySelectorAll(UISelectors.listItems);
            // then we need an array but for this we need to
            // convert the node list (listItems) to an array
            listItems = Array.from(listItems);
            // now we can use a for each loop
            listItems.forEach(function (listItem){
                const itemId = listItem.getAttribute('id');
                if(itemId === `item-${item.id}`){
                    document.querySelector(`#${itemId}`).innerHTML =
                        `<strong>${item.name}:</strong> <em>${item.calories} Calories</em>
                         <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>`;
                }
            });
        },
        deleteListItem: function(id){
            const itemId = `#item-${id}`;
            const item = document.querySelector(itemId);
            //remove the item
            item.remove();
        },
        clearInput: function(){
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';
        },
        addItemToForm: function(){
            document.querySelector(UISelectors.itemNameInput).value = itemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCaloriesInput).value = itemCtrl.getCurrentItem().calories;
            uiCtrl.showEditState();
        },
        removeItems: function (){
            let listItems = document.querySelectorAll(UISelectors.listItems);
            // turn nodelist into array
            listItems = Array.from(listItems);

            listItems.forEach(function (item){
               item.remove();
            });
        },
        hideList: function(){
            document.querySelector(UISelectors.itemList).style.display = 'none';
        },
        showTotalCalories: function(totalCalories){
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
        },
        clearEditState: function(){
            uiCtrl.clearInput();
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
        },
        showEditState: function(){
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'none';
        },
        getSelectors: function () {
            return UISelectors;
        }
    }
})();

// 4. App Controller ################################################################################
const appCtrl = (function (itemCtrl,storageCtrl, uiCtrl) {
    // Load event listeners
    const loadEventListeners = function () {
        // get UI selectors
        const uiSelectors = uiCtrl.getSelectors();
        // add item event
        document.querySelector(uiSelectors.addBtn).addEventListener('click', itemAddSubmit);

        // disable submit on pressing enter
        document.addEventListener('keypress', function(e){
            if(e.keyCode === 13 || e.which === 13){
                e.preventDefault();
                return false;
            }
        });

        //Edit icon click event
        document.querySelector(uiSelectors.itemList).addEventListener('click', itemEditClick);

        // Update item event
        document.querySelector(uiSelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

        // Delete item event
        document.querySelector(uiSelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

        // Back button event
        document.querySelector(uiSelectors.backBtn).addEventListener('click', uiCtrl.clearEditState);

        // clear all items event
        document.querySelector(uiSelectors.clearBtn).addEventListener('click', clearAllItemsClick);

    }

    // Add item submit
    const itemAddSubmit = function (e) {
        // get form input form UI controller
        const input = uiCtrl.getItemInput();
        // check for name and calorie input
        if (input.name !== '' && input.calories !== '') {
            // add item
            const newItem = itemCtrl.addItem(input.name, input.calories);
            // add item to UI list
            uiCtrl.addListItem(newItem);
            // get total calories
            const totalCalories = itemCtrl.getTotalcalories();
            // add total calories to the UI
            uiCtrl.showTotalCalories(totalCalories);

            //store in local Storage
            storageCtrl.storeItem(newItem);
            //clear fields
            uiCtrl.clearInput();
        }
        e.preventDefault();
    }

    // Update item submit
    const itemEditClick = function (e) {
        if(e.target.classList.contains('edit-item')){
            // get list item id: item-0, item-1
            const listId = e.target.parentNode.parentNode.id;
            // Break into an array
            const listIdArray = listId.split('-');
            // get actual id
            const id = parseInt(listIdArray[1]);
            // get actual item
            const itemToEdit = itemCtrl.getItemById(id);
            // set current item
            itemCtrl.setCurrentItem(itemToEdit);
            // add item to form
            uiCtrl.addItemToForm();
        }
        e.preventDefault();
    }
    
    const itemUpdateSubmit = function (e) {
        // get item input
        const input = uiCtrl.getItemInput();

        // update item
        const updatedItem = itemCtrl.updateItem(input.name, input.calories);

        // update UI
        uiCtrl.updateListItem(updatedItem);
        // get total calories
        const totalCalories = itemCtrl.getTotalcalories();
        // add total calories to the UI
        uiCtrl.showTotalCalories(totalCalories);

        // update local storage
        storageCtrl.updateItemStorage(updatedItem);
        uiCtrl.clearEditState();

        e.preventDefault();
    }
    
    // Delete button event
    const itemDeleteSubmit = function (e) {

        // get current item
        const currentItem = itemCtrl.getCurrentItem();

        // Delete from data structure
        itemCtrl.deleteItem(currentItem.id);

        // delete from UI
        uiCtrl.deleteListItem(currentItem.id);

        // get total calories
        const totalCalories = itemCtrl.getTotalcalories();
        // add total calories to the UI
        uiCtrl.showTotalCalories(totalCalories);

        // delete from local storage
        storageCtrl.deleteItemFromStorage(currentItem.id);

        uiCtrl.clearEditState();

        e.preventDefault();
    }

    const clearAllItemsClick = function (e) {
        // Delete all items from data structure
        itemCtrl.clearAllItems();

        // get total calories
        const totalCalories = itemCtrl.getTotalcalories();
        // add total calories to the UI
        uiCtrl.showTotalCalories(totalCalories);

        // Remove items from the ui
        uiCtrl.removeItems();

        // clear from local storage;
        storageCtrl.clearItemsFromStorage();

        // hide ul list
        uiCtrl.hideList();

        e.preventDefault();
    }

    // Public methods
    return {
        init: function () {

            //clear state
            uiCtrl.clearEditState();
            // Fetch items from data structure
            const items = itemCtrl.getItems();
            // check if any items present
            if (items.length === 0) {
                uiCtrl.hideList();
            } else {
                // Populate UI list with items
                uiCtrl.populateItemList(items);
            }
            // get total calories
            const totalCalories = itemCtrl.getTotalcalories();
            // add total calories to the UI
            uiCtrl.showTotalCalories(totalCalories);
            // load event listeners
            loadEventListeners();
        }
    }
})(itemCtrl, storageCtrl, uiCtrl);
// init app
appCtrl.init();

