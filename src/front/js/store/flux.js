import Swal from 'sweetalert2'
const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			current_user: null,
			auth: false,
			username: null,
			first_name: null,
			last_name: null,
			password: null,

			favorites_s: [],
			favorites_s_search: [],
			favorites_id: null,
			favorites_deleted: false,

			users: [],
			users_search: [],
			user_id: null,

			books: [],
			books_search: [],
			book_id: null,

			user_login: JSON.parse(localStorage.getItem("user_login")) == undefined ? {} : JSON.parse(localStorage.getItem("user_login")),
			is_logued: false,

			correct_answer: false,
			password_changed: false,

			show_modal: false,

			buttons_admin_tech: {
				users: JSON.parse(localStorage.getItem("btnUsers")) == undefined ? true : JSON.parse(localStorage.getItem("btnUsers")),
				books: JSON.parse(localStorage.getItem("btnBooks")) == undefined ? true : JSON.parse(localStorage.getItem("btnBooks")),
				favorites_s_admin: JSON.parse(localStorage.getItem("btnFavorites_sAdmin")) == undefined ? true : JSON.parse(localStorage.getItem("btnFavorites_sAdmin")),
				login: JSON.parse(localStorage.getItem("btnLogin")) == undefined ? false : JSON.parse(localStorage.getItem("btnLogin")),
				account: JSON.parse(localStorage.getItem("btnAccount")) == undefined ? true : JSON.parse(localStorage.getItem("btnAccount"))
			},

		},
		actions: {
			login_user: async () => {

				const store = getStore()
				const actions = getActions()
				try {
					let user = {}
					if (store.username == null) {
						user = null
					} else if (store.password == null) {
						user = {
							username: store.username
						}
					}
					else {
						user = {
							username: store.username,
							password: store.password
						}
					}
					const response = await fetch(process.env.BACKEND_URL + "/login", {
						method: 'POST',
						body: JSON.stringify(user),
						headers: {
							'Content-Type': 'application/json'
						}
					})
					const result = await response.json()

					if (result.msg == "ok") {
						Swal.fire({
							position: 'top-end',
							icon: 'success',
							title: 'G00D',
							text: `W3LC0M3 ${result.User.first_name} ${result.User.last_name}`,
							showConfirmButton: false,
							color: '#FFFFFF',
							background: '#41206C',
							timer: 3000
						})
						localStorage.setItem("jwt-token", result.access_token);
						localStorage.setItem("user_login", JSON.stringify(result.User))
						setStore({ user_login: result.User })
						// actions.active_buttons_by_role()
						setStore({ is_logued: true })
						actions.clear_store()

					} else {
						Swal.fire({
							position: 'top-end',
							icon: 'error',
							title: 'Opppsss',
							text: result.message,
							showConfirmButton: false,
							color: '#FFFFFF',
							background: '#41206C',
							timer: 3000
						})
					}

				} catch (error) {
					console.log(error + " Error in login_user backEnd")
					setStore({ is_logued: false })
				}
			},
			logout: () => {
				setStore({ is_logued: false })
				setStore({
					buttons_admin_tech: {
						users: true, favorites_s_admin: true,
						books: true, login: false, account: true
					}
				})
				setStore({ user_login: {} })
				localStorage.clear();
			},
			isAuth: async () => {
				const token = localStorage.getItem('jwt-token')

				const response = await fetch(process.env.BACKEND_URL + "/isauth", {
					method: 'GET',
					headers: {
						"Content-Type": "application/json",
						'Authorization': 'Bearer ' + token // ⬅⬅⬅ authorization token
					}
				})
				const result = await response.json()
				console.log(result)
				if (response.ok){
					setStore({ current_user: result })
				 } else {
					setStore({ current_user: false })
				 }
			},
			search_users: (input) => {
				const store = getStore();

				const newUser = store.users_search.filter(user => {
					if (user.first_name.toLowerCase().includes(input.toLowerCase()) ||
						user.last_name.toLowerCase().includes(input.toLowerCase()) ||
						user.id.toString().includes(input)) {
						return user
					}
				})
				setStore({ users: newUser })
			},
            add_favorites: (selectedItem) => {
				let listOfFavorites = getStore().favorites;
				if (!listOfFavorites.includes(selectedItem)) {
					setStore({ favorites: listOfFavorites.concat(selectedItem) });
				}
			},
			//delete selectedFavorite from favorites' list
			delete_favorites: (selectedFavorite) => {
				let listOfFavorites = getStore().favorites;
				setStore({ favorites: listOfFavorites.filter((item) => item !== selectedFavorite) });
			},
			get_all_books: async () => {
				const token = localStorage.getItem('jwt-token')
				const response = await fetch(process.env.BACKEND_URL + '/book', {
					method: 'GET',
					headers: {
						"Content-Type": "application/json",
						'Authorization': 'Bearer ' + token // ⬅⬅⬅ authorization token
					}
				})
				const result = await response.json()
				setStore({ books: result.books })
				setStore({ books_search: result.books })
			},
			add_book: async () => {
				const token = localStorage.getItem('jwt-token')
				const store = getStore()
				const actions = getActions()

				let book = {}
				if (store.name != null) {
					book.name = store.name
				}
				if (store.description != null) {
					book.description = store.ldescription
				}
				if (store.author != null) {
					book.author = store.author
				}

				const response = await fetch(process.env.BACKEND_URL + '/book', {
					method: 'POST',
					body: JSON.stringify(book),
					headers: {
						"Content-Type": "application/json",
						'Authorization': 'Bearer ' + token // ⬅⬅⬅ authorization token
					}
				})
				const result = await response.json()

				if (result.msg == "ok") {
					actions.handle_delete_modal()
					Swal.fire({
						position: 'top-end',
						icon: 'success',
						title: 'Add',
						text: `The Book ${result.book.name} ${result.book.description} was added`,
						showConfirmButton: false,
						color: '#FFFFFF',
						background: '#41206C',
						timer: 3000
					})
					actions.clear_store()
				} else {
					Swal.fire({
						position: 'top-end',
						icon: 'error',
						title: 'Opppsss',
						text: result.message,
						showConfirmButton: false,
						color: '#FFFFFF',
						background: '#41206C',
						timer: 3000
					})
				}

			},
			search_books: (input) => {
				const store = getStore()
				const newBook = store.books_search.filter(book => {
					if (book.id.toString().includes(input) ||
						book.name.toLowerCase().includes(input.toLowerCase()) ||
						book.description.toLowerCase().includes(input.toLowerCase()) ||
						book.author.toLowerCase().includes(input.toLowerCase())) {
						return book
					}
				})
				setStore({ books: newBook })
			},

			get_all_favorites_s: async () => {
				const token = localStorage.getItem('jwt-token')
				const response = await fetch(process.env.BACKEND_URL + '/favorites', {
					method: 'GET',
					headers: {
						"Content-Type": "application/json",
						'Authorization': 'Bearer ' + token // ⬅⬅⬅ authorization token
					}
				})
				const result = await response.json()
				setStore({ favorites_s: result.Favorites_s })
				setStore({ favorites_s_search: result.Favorites_s })
			},
			add_favorites: async () => {
				const token = localStorage.getItem('jwt-token')
				const store = getStore()
				const actions = getActions()

				let favorites = {}

				favorites.code = store.code

				if (store.type != null) {
					favorites.type = store.type
				}
				if (store.model != null) {
					favorites.model = store.model
				}
				if (store.book_id != null) {
					favorites.id_book = store.book_id
				}

				const response = await fetch(process.env.BACKEND_URL + "/favorites", {
					method: 'POST',
					body: JSON.stringify(favorites),
					headers: {
						"Content-Type": "application/json",
						'Authorization': 'Bearer ' + token // ⬅⬅⬅ authorization token
					}
				}

				)
				const result = await response.json()
				if (result.msg == "ok") {
					actions.handle_delete_modal()
					Swal.fire({
						position: 'top-end',
						icon: 'success',
						title: 'Add',
						text: `The Job ${result.Job.code} was added`,
						showConfirmButton: false,
						color: '#FFFFFF',
						background: '#41206C',
						timer: 3000
					})
					actions.clear_store()

				} else {
					Swal.fire({
						position: 'top-end',
						icon: 'error',
						title: 'Opppsss',
						text: result.message,
						showConfirmButton: false,
						color: '#FFFFFF',
						background: '#41206C',
						timer: 3000
					})
				}
			},
			search_favoritess: (input) => {
				const store = getStore();

				const newFavorites= store.favorites_s_search.filter(favorites => {
					if (favorites.code.includes(input) ||
						favorites.type.toLowerCase().includes(input.toLowerCase()) ||
						favorites.id.toString().includes(input)) {
						return favorites
					}
				})
				setStore({ favorites_s: newFavorites })
			},
			handle_show_modal: () => {
				const store = getStore()
				const actions = getActions()
				setStore({ show_modal: true })
				if (!!store.user_id != true) {
					setStore({ read_only_username: false })
					setStore({ hidden_id: true })
				}
				if (!!store.book_id != true) {
					setStore({ hidden_id: true })
				}
				if (!!store.favorites_id != true) {
					actions.random_code_favorites()
					setStore({ hidden_id: true })
					setStore({ hidden_time_stamp: true })
					setStore({ hidden_btn_new_code: false })
				}
			},
			handle_delete_modal: () => {
				const actions = getActions()

				setStore({ show_modal: false })
				setStore({ user_id: null })
				setStore({ book_id: null })
				setStore({ favorites_id: null })

				actions.clear_store()

			},

			handleSubmit: async (e, data) => {
				e.preventDefault();
				const response = await fetch(process.env.BACKEND_URL + '/send_email', {
					method: 'POST',
					body: JSON.stringify(data),
					headers: {
						"Content-Type": "application/json"
					}
				})
				// const result = await response.json()

				if (response.ok) {
					Swal.fire({
						position: 'top-end',
						icon: 'success',
						title: 'Success',
						text: `Message sent succesdfully`,
						showConfirmButton: false,
						color: '#FFFFFF',
						background: '#41206C',
						timer: 3000
					})
				} else {
					Swal.fire({
						position: 'top-end',
						icon: 'error',
						title: 'Opppsss',
						text: "At this moment we can't send your message",
						showConfirmButton: false,
						color: '#FFFFFF',
						background: '#41206C',
						timer: 3000
					})
				}
			},
			handle_change: (e) => {
				setStore({ [e.target.name]: e.target.value })
			},
		}
	};
};

export default getState;
