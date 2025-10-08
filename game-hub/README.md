# GameHub

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.0.3.

GameHub is a responsive Angular application that displays video game data fetched from the [RAWG API](https://rawg.io/apidocs). It demonstrates modern frontend development techniques including responsive design with Tailwind CSS, clean data handling through Angular services, and an example authentication system with a fake backend.

---

## 🎨 Styling and Responsiveness

GameHub uses **Tailwind CSS** for styling and layout.
Tailwind’s utility-first approach enables a fully **responsive interface** that adapts to any device size — from mobile phones to large desktop screens.

You can customize or extend styles by modifying the `tailwind.config.js` file or by applying Tailwind utility classes directly in component templates.

For setup or configuration details, refer to [Tailwind CSS for Angular](https://tailwindcss.com/docs/guides/angular).

---

## 🌐 Data Fetching and API Integration

The application integrates with the **RAWG API** to fetch and display real-time game data such as titles, genres, screenshots, and ratings.

Key aspects:

- Uses Angular’s **HttpClient** for all API requests.
- API logic is encapsulated in reusable **services**.
- Implements **RxJS Observables** for asynchronous data streams.
- Handles loading and error states gracefully for smooth user experience.
- Processes and formats the data before displaying it in the UI.

---

## 🔐 Authentication (Fake Backend)

A **mock authentication system** is implemented to demonstrate secure user authentication flows.

Highlights:

- Simulates backend responses using a **fake backend interceptor**.
- Allows user login and logout using local storage to persist session state.
- Implements **route guards** to protect private routes.
- Provides a realistic demonstration of integrating authentication into an Angular app without needing a live server.

---

## 🧰 Technologies Used

- **Angular 20**
- **TypeScript**
- **Tailwind CSS**
- **RxJS / Observables**
- **Angular Router**
- **Fake Backend Authentication**
- **RAWG API Integration**

---

## 🚀 Development Server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`.
The application will automatically reload whenever you modify any of the source files.

---

## 🧱 Code Scaffolding

Angular CLI includes powerful scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

---

## 🏗️ Building

To build the project for production, run:

```bash
ng build
```

This compiles your project and stores the build artifacts in the `dist/` directory.
By default, the production build is optimized for performance and speed.

---

## 📚 Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli).
