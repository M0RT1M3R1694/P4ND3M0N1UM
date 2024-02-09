import Swal from 'sweetalert2'
const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			current_user: null,
			auth: false,
			username: null,
			first_name: null,
			last_name: null,
			email: null,
			password: null,
			role: null,

			name: "",
			description: "",
			year: "",
			author: "",

			favorites: [],
			favorites_search: [],
			favorites_id: null,
			favorites_deleted: false,

			users: [],
			users_search: [],
			user_id: null,

			book: [],
			book_search: [],
			book_id: null,
			fantasyBooks: [],
			romanceBooks: [],
			horrorBooks: [],
			thrillerBooks: [],

			ourCategories: [],
			ourCategories_search: [],
			categories_id: null,

			login_user: JSON.parse(localStorage.getItem("login_user")) == undefined ? {} : JSON.parse(localStorage.getItem("login_user")),
			current_user: false,

			correct_answer: false,
			password_changed: false,

			show_modal: false,

			buttons_admin_tech: {
				users: JSON.parse(localStorage.getItem("btnUsers")) == undefined ? true : JSON.parse(localStorage.getItem("btnUsers")),
				books: JSON.parse(localStorage.getItem("btnBooks")) == undefined ? true : JSON.parse(localStorage.getItem("btnBooks")),
				favorites_s_admin: JSON.parse(localStorage.getItem("btnFavorites_sAdmin")) == undefined ? true : JSON.parse(localStorage.getItem("btnFavorites_sAdmin")),
			},

		},
		actions: {
			login_user: async () => {

				const store = getStore()
				const actions = getActions()
				try {
					let user = {}
					if (store.username === null) {
						user = null
					} else if (store.password === null) {
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
					console.log("el usuario muestra", user.username, " la contraseña es", user.password)
					const response = await fetch(process.env.BACKEND_URL + 'api/login', {
						method: 'POST',
						body: JSON.stringify(user),
						headers: {
							'Content-Type': 'application/json'
						}
					})
					const result = await response.json()
					console.log(result)

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
						setStore({ current_user: result.user })
						return true

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
					console.log(error + "Error in login_user backEnd")
					setStore({ current_user: false })
				}
			},
			logout: () => {
				setStore({ current_user: false })
				localStorage.removeItem("jwt-token");
			},
			isAuth: async () => {
				const token = localStorage.getItem('jwt-token')

				const response = await fetch(process.env.BACKEND_URL + 'api/isAuth', {
					method: 'GET',
					headers: {
						"Content-Type": "application/json",
						'Authorization': 'Bearer ' + token // ⬅⬅⬅ authorization token
					}
				})
				const result = await response.json()
				console.log(result)
				if (response.ok) {
					setStore({ current_user: result })
				} else {
					setStore({ current_user: false })
				}
			},
			// search_users: (input) => {
			// 	const store = getStore();

			// 	const newUser = store.users_search.filter(user => {
			// 		if (user.first_name.toLowerCase().includes(input.toLowerCase()) ||
			// 			user.last_name.toLowerCase().includes(input.toLowerCase()) ||
			// 			user.id.toString().includes(input)) {
			// 			return user
			// 		}
			// 	})
			// 	setStore({ users: newUser })
			// },
			// delete_favorites: (selectedFavorite) => {
			// 	let listOfFavorites = getStore().favorites;
			// 	setStore({ favorites: listOfFavorites.filter((item) => item !== selectedFavorite) });
			// },
			fetchBook: async () => {
				try {
					const token = localStorage.getItem('jwt-token');
					const response = await fetch(process.env.BACKEND_URL + 'api/book', {
						method: 'GET',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': 'Bearer ' + token
						}
					});
					if (!response.ok) {
						throw new Error('Network response was not ok');
					}
					const result = await response.json();
					if (result && result.msg === "ok") {
						// Puedes realizar alguna acción con los libros obtenidos
						setStore({ book: result.books });
						console.log(result.books);
					} else {
						console.error(result.message || 'Error fetching books');
					}
				} catch (error) {
					console.error('Error fetching books:', error.message);
					console.error('Error details:', error.message);
				}
			},
			addBookById: async () => {
				const store = getStore();
				const actions = getActions();

				try {
					const token = localStorage.getItem('jwt-token');
					const bookData = {
						name: store.name || "",
						description: store.description || "",
						year: store.year || "",
						author: store.author || "",
					};

					const url = store.book_id ? `https://sturdy-space-memory-jxjv46qrgj5hq4pp-3001.app.github.dev/api/book/${store.book_id}` : 'https://sturdy-space-memory-jxjv46qrgj5hq4pp-3001.app.github.dev/api/book';

					const response = await fetch(url, {
						method: store.book_id ? 'PUT' : 'POST',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': 'Bearer ' + token
						},
						body: JSON.stringify(bookData)
					});

					if (!response.ok) {
						throw new Error('Network response was not ok');
					}

					const result = await response.json();
					if (result.msg === "ok") {
						actions.fetchBook(); // Actualiza la lista de libros después de agregar o actualizar
						actions.handle_delete_modal(); // Cierra el modal después de la operación
						Swal.fire({
							position: 'top-end',
							icon: 'success',
							title: 'Add',
							text: `The Book ${result.book.name} was added`,
							showConfirmButton: false,
							color: '#FFFFFF',
							background: '#41206C',
							timer: 3000
						});
						actions.clear_store();
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
						});
					}
				} catch (error) {
					console.error("Error adding or updating book:", error.message);
					setStore({ fetchBook: false });
				}
			},

			fetchUsers: async () => {
				try {
					const response = await fetch(process.env.BACKEND_URL + 'api/user', {
						method: 'GET',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': 'Bearer ' + localStorage.getItem('jwt-token') // Si es necesario, incluye el token de autorización
						}
					});

					const result = await response.json();

					if (response.ok && result.msg === "ok") {
						// Puedes realizar alguna acción con los usuarios obtenidos
						setStore({ users: result.Users });
					} else {
						// Manejo de error si la solicitud no fue exitosa
						console.error(result.message || 'Error fetching users');
					}
				} catch (error) {
					// Manejo de error en caso de una excepción durante la solicitud
					console.error('Error fetching users:', error.message);
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
			fetchFavorites: async () => {
				try {
					const token = localStorage.getItem('jwt-token');
					const response = await fetch(process.env.BACKEND_URL + 'api/favorites', {
						method: 'GET',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': 'Bearer ' + token
						}
					});
					if (!response.ok) {
						throw new Error('Network response was not ok');
					}
					const result = await response.json();
					if (result && result.msg === "ok") {
						setStore({ favorites: result.favorites_s });
						console.log(result.favorites_s);
					} else {
						console.error(result.message || 'Error fetching favorites_s');
					}
				} catch (error) {
					console.error('Error fetching favorites:', error.message);
					console.error('Error details:', error.message);
				}
			},
			add_favorites: async () => {
				const token = localStorage.getItem('jwt-token')
				const store = getStore()
				const actions = getActions()

				let favorites = {}

				favorites.code = store.code

				// if (store.type != null) {
				// 	favorites.type = store.type
				// }
				// if (store.model != null) {
				// 	favorites.model = store.model
				// }
				if (store.book_id != null) {
					favorites.id_book = store.book_id
				}

				const response = await fetch(process.env.BACKEND_URL + "api/favorites", {
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
			deleteBookById: async (bookId) => {
				const actions = getActions()
				try {
					const token = localStorage.getItem('jwt-token');
					const response = await fetch(`https://sturdy-space-memory-jxjv46qrgj5hq4pp-3001.app.github.dev/api/book/${bookId}`, {
						method: 'DELETE',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': 'Bearer ' + token
						},
					});

					if (!response.ok) {
						throw new Error("Network response was not ok");
					}

					const result = await response.json();
					if (result && result.msg === "ok") {
						console.log("Book ${bookId} deleted successfully");
						actions.fetchBook();
					} else {
						console.error(result.message || "Error deleting book");
					}
				} catch (error) {
					console.error("Error deleting book:", error.message);
				}
			},
			signUp: async () => {
				const store = getStore();
				const actions = getActions();

				try {
					const userCredentials = {
						username: store.username || "",
						first_name: store.first_name || "",
						last_name: store.last_name || "",
						email: store.email || "",
						password: store.password || "",
						role: store.role || ""
					};

					const response = await fetch(process.env.BACKEND_URL + 'api/signup', {
						method: "POST",
						body: JSON.stringify(userCredentials),
						headers: {
							"Content-type": "application/json"
						}
					});

					if (!response.ok) {
						throw new Error('Network response was not ok');
					}
					if (response.status === 200) {
						const data = await response.json();
						console.log(data);
						return true;
					}


				} catch (error) {
					console.error("Error signing up:", error.message);
					// Puedes manejar el error según tu necesidad aquí
				}
			},
			loadFantasyBooks: async () => {
				try { 
					const apiUrl = 'https://www.googleapis.com/books/v1/volumes?q=subject:fantasy';
					const response = await fetch(apiUrl);
					const data = await response.json();

					setStore({ fantasyBooks: data.items })
				} catch(error) {
					console.error('Error:', error);
				}
			},
			loadRomanceBooks: async () => {
				try { 
					const apiUrl = 'https://www.googleapis.com/books/v1/volumes?q=subject:romance';
					const response = await fetch(apiUrl);
					const data = await response.json();

					setStore({ romanceBooks: data.items })
				} catch(error) {
					console.error('Error:', error);
				}
			},
			loadHorrorBooks: async () => {
				try { 
					const apiUrl = 'https://www.googleapis.com/books/v1/volumes?q=subject:horror';
					const response = await fetch(apiUrl);
					const data = await response.json();

					setStore({ horrorBooks: data.items })
				} catch(error) {
					console.error('Error:', error);
				}
			},
			loadThrillerBooks: async () => {
				try { 
					const apiUrl = 'https://www.googleapis.com/books/v1/volumes?q=subject:thriller';
					const response = await fetch(apiUrl);
					const data = await response.json();

					setStore({ thrillerBooks: data.items })
				} catch(error) {
					console.error('Error:', error);
				}
			},
			handle_show_modal: (userId, bookId) => {
				setStore({ show_modal: true });
				setStore({ user_id: userId || null });
				setStore({ book_id: bookId || null });
				// Puedes agregar más setStore según tus necesidades
				// Además, puedes realizar otras acciones si es necesario
				// actions.otra_accion();
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
				const result = await response.json()

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

			// test: async() => {
			// 	let result = await fetch("https://sturdy-space-memory-jxjv46qrgj5hq4pp-3001.app.github.dev/api/test")
			// 	let data = await result.json()
			// 	alert(data)
			// }
		}
	};
};

export default getState;
