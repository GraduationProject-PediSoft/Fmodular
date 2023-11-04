# Frontend Pedisoft

This repository contains the frontend project for pedisoft services written in angular 16.2.8. The project has a few important dependencies:

 - [Primeng](https://primeng.org/): Graphic components (buttons, tables, lists, etc)
 - [Vtkjs](https://kitware.github.io/vtk-js/index.html): Javascript components for interaction with the vtk library
 - [Itk-wasm](https://wasm.itk.org/en/latest/index.html): File adapters for many image formats (dicom, jpeg, png, etc)
 - [Tailwind](https://tailwindcss.com/): A utility-first CSS framework for better styles writting
 - [Apollo](https://www.apollographql.com/docs/): Graphql client for the angular framework

And other ones, but these are the most important ones that a developer should have in mind if he wants to continue the project.
 
# Environment
The files inside the [environment](https://github.com/GraduationProject-PediSoft/Fmodular/tree/master/src/environments) folder contains the **urls** for the backend services. Should edit them according to the needs

# Running

The project was designed to be executed in a containerized environment. In this repo [Docker](https://www.docker.com/) was used for it, but podman or kubernetes could be used with little configuration. The compose file builds and executes the nginx web server without any additional configuration, simply run:

```sh
docker compose up -d
```
The project will run on [http://localhost:12122](http://localhost:12122), the compose file defines the port and can be changed if needed
