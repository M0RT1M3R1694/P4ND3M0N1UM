import Swal from 'sweetalert2'
const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
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
			read_only_username: true,
			user_deleted: false,

			books: [],
			books_search: [],
			book_id: null,

			user_login: JSON.parse(localStorage.getItem("user_login")) == undefined ? {} : JSON.parse(localStorage.getItem("user_login")),
			user_question: {},
			is_logued: false,

			hidden_username: null,
			hidden_id: null,

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
							title: 'Good',
							text: `Welcome ${result.User.first_name} ${result.User.last_name}`,
							showConfirmButton: false,
							color: '#FFFFFF',
							background: '#41206C',
							timer: 3000
						})
						localStorage.setItem("jwt-token", result.access_token);
						localStorage.setItem("user_login", JSON.stringify(result.User))
						setStore({ user_login: result.User })
						actions.active_buttons_by_role()
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
			active_buttons_by_role: () => {
				const store = getStore()
				if (store.user_login.role == "admin") {
					localStorage.setItem("btnUsers", false)
					localStorage.setItem("btnFavorites_sAdmin", false)
					localStorage.setItem("btnBooks", false)
					localStorage.setItem("btnLogin", true)
					localStorage.setItem("btnAccount", false)
					setStore({
						buttons_admin_tech: {
							users: false, favorites_s_admin: false,
							books: false, login: true, account: false
						}
					})
				}
			},
			forgot_password: async () => {
				const store = getStore()
				const actions = getActions()

				try {
					const response = await fetch(process.env.BACKEND_URL + `/user/${store.username}`, {
						method: 'GET'
					})
					const result = await response.json()

					if (store.username == "" || store.username == null) {
						Swal.fire({
							position: 'top-end',
							icon: 'error',
							title: 'Opppsss',
							text: "Please enter the username",
							showConfirmButton: false,
							color: '#FFFFFF',
							background: '#41206C',
							timer: 3000
						})
					}
					else if (result.msg == "ok") {
						setStore({ hidden_username: true })
						actions.clear_store()
					}
					else {
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
					console.log(error + " Error in forgot_password backEnd")
				}

			check_question_answer: () => {
				const store = getStore()
				const actions = getActions()

				if (store.question_security == null || store.answer_security == null || store.answer_security == "") {
					Swal.fire({
						position: 'top-end',
						icon: 'error',
						title: 'Opppsss',
						text: "Please select the question and enter the answer",
						showConfirmButton: false,
						color: '#FFFFFF',
						background: '#41206C',
						timer: 3000
					})
				}
				else if (store.user_question.question_security == store.question_security && store.user_question.answer_security == store.answer_security) {
					setStore({ correct_answer: true })
					actions.clear_store()

				} else {
					Swal.fire({
						position: 'top-end',
						icon: 'error',
						title: 'Opppsss',
						text: "Please enter the correct information",
						showConfirmButton: false,
						color: '#FFFFFF',
						background: '#41206C',
						timer: 3000
					})
				}
			},
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

			get_all_users: async () => {

				const token = localStorage.getItem('jwt-token')
				const response = await fetch(process.env.BACKEND_URL + '/user', {
					method: 'GET',
					headers: {
						"Content-Type": "application/json",
						'Authorization': 'Bearer ' + token // ⬅⬅⬅ authorization token
					}
				})
				const result = await response.json()
				setStore({ users: result.Users })
				setStore({ users_search: result.Users })

			},
			get_user_by_id: async (user_id) => {
				const token = localStorage.getItem('jwt-token')
				setStore({ hidden_input_question_answer: true })
				setStore({ read_only_username: true })
				setStore({ hidden_id: false })
				setStore({ show_modal: true })
				const response = await fetch(process.env.BACKEND_URL + `/user/${user_id}`, {
					method: 'GET',
					headers: {
						"Content-Type": "application/json",
						'Authorization': 'Bearer ' + token // ⬅⬅⬅ authorization token
					}
				})
				const result = await response.json()
				setStore({ user_id: result.User })

			},
			add_user: async () => {
				const token = localStorage.getItem('jwt-token')
				setStore({ hidden_input_question_answer: false })
				setStore({ read_only_username: false })
				const store = getStore()
				const actions = getActions()

				let user = {}
				if (store.username != null) {
					user.username = store.username
				}
				if (store.first_name != null) {
					user.first_name = store.first_name
				}
				if (store.last_name != null) {
					user.last_name = store.last_name
				}
				if (store.password != null) {
					user.password = store.password
				}

				const response = await fetch(process.env.BACKEND_URL + '/user', {
					method: 'POST',
					body: JSON.stringify(user),
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
						text: `The User ${result.User.first_name} ${result.User.last_name} was added`,
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
			update_user_by_id: async (user_id) => {
				const token = localStorage.getItem('jwt-token')
				const store = getStore()
				const actions = getActions()
				setStore({ hidden_input_question_answer: true })
				let user = {}
				if (store.first_name != null) {
					user.first_name = store.first_name
				}
				if (store.last_name != null) {
					user.last_name = store.last_name
				}
				if (store.password != null) {
					user.password = store.password
				}

				const response = await fetch(process.env.BACKEND_URL + `/user/${user_id}`, {
					method: 'PUT',
					body: JSON.stringify(user),
					headers: {
						"Content-Type": "application/json",
						'Authorization': 'Bearer ' + token
					}
				})
				const result = await response.json()
				if (result.msg == "ok") {
					Swal.fire({
						position: 'top-end',
						icon: 'success',
						title: 'Done',
						text: "The user " + store.user_id.username + " was updated",
						showConfirmButton: false,
						color: '#FFFFFF',
						background: '#41206C',
						timer: 3000
					})
					actions.handle_delete_modal()
					actions.clear_store()
				}
				else {
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
			delete_user_by_id: async (user_id) => {
				const token = localStorage.getItem('jwt-token')
				const response = await fetch(process.env.BACKEND_URL + `/user/${user_id.id}`, {
					method: 'DELETE',
					headers: {
						"Content-Type": "application/json",
						'Authorization': 'Bearer ' + token // ⬅⬅⬅ authorization token
					}
				})
				const result = await response.json()
				if (result.msg == "ok") {
					setStore({ user_deleted: true })
					Swal.fire({
						title: 'Deleted!',
						text: `The user ${user_id.first_name} ${user_id.last_name} was deleted`,
						icon: 'success',
						showConfirmButton: false,
						color: '#FFFFFF',
						background: '#41206C',
						timer: 2000
					})
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
			search_users: (input) => {
				const store = getStore();

				const newUser = store.users_search.filter(user => {
					if (user.first_name.toLowerCase().includes(input.toLowerCase()) ||
						user.last_name.toLowerCase().includes(input.toLowerCase()) ||
						user.role.toLowerCase().includes(input.toLowerCase()) ||
						user.id.toString().includes(input)) {
						return user
					}
				})
				setStore({ users: newUser })
			},
			delete_user_change: () => {
				setStore({ user_deleted: false })
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
			get_book_by_id: async (book_id) => {
				const token = localStorage.getItem('jwt-token')
				setStore({ show_modal: true })
				setStore({ hidden_id: false })

				const response = await fetch(process.env.BACKEND_URL + `/book/${book_id}`, {
					method: 'GET',
					headers: {
						"Content-Type": "application/json",
						'Authorization': 'Bearer ' + token // ⬅⬅⬅ authorization token
					}
				})
				const result = await response.json()
				setStore({ book_id: result.Book })

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
					book.description = store.description
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
						text: `The book ${result.book.name} ${result.book.description} was added`,
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
			update_book_by_id: async (book_id) => {
				const token = localStorage.getItem('jwt-token')
				const store = getStore()
				const actions = getActions()

				let book = {}
				if (store.name != null) {
					book.name = store.name
				}
				if (store.description != null) {
					book.description = store.description
				}
				if (store.author != null) {
					book.author = store.author
				}

				const response = await fetch(process.env.BACKEND_URL + `/book/${book_id}`, {
					method: 'PUT',
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
						title: 'Done',
						text: `The book ${store.book_id.name} ${store.book_id.description} was updated`,
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
			get_favorites_by_id: async (favorites_id) => {
				const token = localStorage.getItem('jwt-token')
				setStore({ show_modal: true })
				setStore({ hidden_id: false })
				setStore({ hidden_time_stamp: false })
				setStore({ hidden_btn_new_code: true })
				const response = await fetch(process.env.BACKEND_URL + `/favorites/${favorites_id}`, {
					method: 'GET',
					headers: {
						"Content-Type": "application/json",
						'Authorization': 'Bearer ' + token // ⬅⬅⬅ authorization token
					}
				})
				const result = await response.json()
				setStore({ favorites_id: result.Favorites })
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
						text: `The favorites ${result.Favorites.code} was added`,
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
			    update_favorites_by_id: async (favorites_id) => {
				const token = localStorage.getItem('jwt-token')
				const store = getStore()
				const actions = getActions()

				let favorites = {}
				if (store.type != null) {
					favorites.type = store.type
				}
				if (store.book_id != null) {
					favorites.id_book = store.book_id
				}
		
				const response = await fetch(process.env.BACKEND_URL + `/favorites/${favorites_id}`, {
					method: 'PUT',
					body: JSON.stringify(favorites),
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
						title: 'Update',
						text: `The Job ${result.Job.code} was updated`,
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
			delete_favorites_by_id: async (favorites_id) => {
				const token = localStorage.getItem('jwt-token')
				const response = await fetch(process.env.BACKEND_URL + `/favorites/${favorites_id.id}`, {
					method: 'DELETE',
					headers: {
						"Content-Type": "application/json",
						'Authorization': 'Bearer ' + token // ⬅⬅⬅ authorization token
					}
				})
				const result = await response.json()
				if (result.msg == "ok") {
					setStore({ job_deleted: true })
					Swal.fire({
						title: 'Deleted!',
						text: `The favorites ${job_id.code} was deleted`,
						icon: 'success',
						showConfirmButton: false,
						color: '#FFFFFF',
						background: '#41206C',
						timer: 2000
					})
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
			search_favorites_s: (input) => {
				const store = getStore();

				const newJob = store.favorites_s_search.filter(favorites => {
					if (favorites.code.includes(input) ||
					favorites.type.toLowerCase().includes(input.toLowerCase()) ||
					favorites.status.toLowerCase().includes(input.toLowerCase()) ||
					favorites.technical.username.toLowerCase().includes(input.toLowerCase()) ||
					favorites.id.toString().includes(input)) {
						return favorites
					}
				})
				setStore({ favorites_s: newFavorites})
			},
			delete_favorites_change: () => {
				setStore({ favorites_deleted: false })
			},
			random_code_favorites: () => {
				const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
				const charactersLength = characters.length;
				let result = "";
				let ch;
				while (result.length < 10) {
					ch = characters.charAt(Math.floor(Math.random() * charactersLength));
					if (!result.includes(ch)) {
						result += ch;
					}
				}
				setStore({ code: result })
			},

			handle_show_modal: () => {
				const store = getStore()
				const actions = getActions()
				setStore({ show_modal: true })
				if (!!store.user_id != true) {
					setStore({ hidden_input_question_answer: false })
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

			clear_store: () => {

				setStore({ username: null })
				setStore({ first_name: null })
				setStore({ last_name: null })
				setStore({ password: null })

				
				setStore({ type: null })
				setStore({ book_id: null })
				
			},

			handle_change: (e) => {
				setStore({ [e.target.name]: e.target.value })
			},
		}
	};
};

export default getState;
