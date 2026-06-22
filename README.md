# Ng22
Home listing application.

Note:
    This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 22.0.3.

References:
* [Tutorial](https://angular.dev/tutorials/first-app/02-Home)

## 1. Home Listing

### 1.1. Create `home` component
```shell
$ npx ng generate component Home --standalone --inline-template
```

In Angular, components have metadata that define its properties. When you create your Home, you use these properties:
* `selector`: to describe how Angular refers to the component in templates.
* `standalone`: to describe whether the component requires a NgModule.
* `imports`: to describe the component's dependencies.
* `template`: to describe the component's HTML markup and layout.
* `styleUrls`: to list the URLs of the CSS files that the component uses in an array.

### 1.2. Create `housing-location` component
```shell
$ npx ng generate component housingLocation --standalone --inline-template
```

### 1.3. Create `housing-location` interface
```shell
$ npx ng generate interface housingLocation
```

## 2. Angular Services

### 2.1. Create `housing` service
```shell
$ npx ng generate service housing --skip-tests
```



## Installation
```shell
@rwibawa ➜ /workspaces $ nvm ls
       v22.22.1
       v24.14.0
       v24.17.0
->       system (-> v24.17.0)
default -> lts/krypton (-> v24.17.0 *)
lts/jod -> v22.23.0 (-> N/A)
lts/krypton -> v24.17.0 *

@rwibawa ➜ /workspaces $ npm --version
11.13.0

@rwibawa ➜ /workspaces $ npm install @angular/cli
@rwibawa ➜ /workspaces $ npx ng new ng22

@rwibawa ➜ /workspaces $ cd ng22/
@rwibawa ➜ /workspaces/ng22 (main) $ npm i
```