const readline = require('readline');

class CinemaTicketSystem {
    constructor() {
        this.movies = [
            { id: 1, name: "Матрица" },
            { id: 2, name: "Железный человек" }
        ];
        this.users = [
            { id: 1, name: "Виктория" },
            { id: 2, name: "Вероника" }
        ];
        this.tickets = [
            { id: 1, userId: 1, movieId: 2 },
            { id: 2, userId: 2, movieId: 1 }
        ];
        this.movieIdCounter = 3;
        this.userIdCounter = 3;
        this.ticketIdCounter = 3;
    }

    addMovie(movieName) {
        const newMovie = { id: this.movieIdCounter++, name: movieName };
        this.movies.push(newMovie);
        return newMovie.id;
    }

    showAllMovies() {
        return this.movies.map(movie => `${movie.id}: ${movie.name}`).join('\n');
    }

    addUser(userName) {
        const newUser = { id: this.userIdCounter++, name: userName };
        this.users.push(newUser);
        return newUser.id;
    }

    buyTicket(userId, movieId) {
        const user = this.users.find(user => user.id === userId);
        const movie = this.movies.find(movie => movie.id === movieId);
        if (user && movie) {
            const newTicket = { id: this.ticketIdCounter++, userId, movieId };
            this.tickets.push(newTicket);
            return newTicket.id;
        }
        return null;
    }

    cancelTicket(ticketId) {
        const ticketIndex = this.tickets.findIndex(ticket => ticket.id === ticketId);
        if (ticketIndex !== -1) {
            this.tickets.splice(ticketIndex, 1);
            return true;
        }
        return false;
    }

    showAllUsers() {
        return this.users.map(user => `${user.id}: ${user.name}`).join('\n');
    }
}

const system = new CinemaTicketSystem();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let lastResult = '';

function showMenu() {
    console.clear();
    console.log("\nСистема управления билетами");
    console.log("1. Показать все фильмы");
    console.log("2. Добавить фильм");
    console.log("3. Добавить пользователя");
    console.log("4. Купить билет");
    console.log("5. Закрыть билет");
    console.log("6. Выйти");
    console.log("\nРезультат последней операции:\n" + lastResult);
}

function handleUserInput(choice) {
    console.clear();
    switch (choice) {
        case '1':
            lastResult = system.showAllMovies();
            mainMenu();
            break;
        case '2':
            rl.question('Введите название фильма: ', (movieName) => {
                const movieId = system.addMovie(movieName);
                lastResult = `Добавлен фильм с ID: ${movieId}`;
                mainMenu();
            });
            break;
        case '3':
            rl.question('Введите имя пользователя: ', (userName) => {
                const userId = system.addUser(userName);
                lastResult = `Добавлен пользователь с ID: ${userId}`;
                mainMenu();
            });
            break;
        case '4':
            console.log('Доступные пользователи:');
            console.log(system.showAllUsers());
            rl.question('Введите ID пользователя: ', (userIdForTicket) => {
                console.log('Доступные фильмов:');
                console.log(system.showAllMovies());
                rl.question('Введите ID фильма: ', (movieIdForTicket) => {
                    const ticketId = system.buyTicket(parseInt(userIdForTicket), parseInt(movieIdForTicket));
                    if (ticketId) {
                        lastResult = `Куплен билет успешно, его ID: ${ticketId}`;
                    } else {
                        lastResult = 'Неправильно введен ID пользователя или фильма';
                    }
                    mainMenu();
                });
            });
            break;
        case '5':
            console.log('Доступные билеты:');
            console.log(system.tickets.map(ticket => `${ticket.id}: Пользователь ${ticket.userId}, Фильм ${ticket.movieId}`).join('\n'));
            rl.question('Введите ID билета: ', (ticketIdToCancel) => {
                const success = system.cancelTicket(parseInt(ticketIdToCancel));
                if (success) {
                    lastResult = 'Билет успешно закрыт';
                } else {
                    lastResult = 'ID билета не найдено';
                }
                mainMenu();
            });
            break;
        case '6':
            console.log('Выход...');
            rl.close();
            break;
        default:
            lastResult = 'Неверный выбор, попробуйте снова';
            mainMenu();
    }
}

function mainMenu() {
    showMenu();
    console.log("----------------------")
    rl.question('Выберите действие: ', handleUserInput);
}

mainMenu();
