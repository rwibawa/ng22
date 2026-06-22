import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Details } from './details/details';

export const routeConfig: Routes = [
    { 
        path: '', 
        component: Home,
        title: 'Home - Housing for All' 
    },
    {
        path: 'details/:id',
        component: Details,
        title: 'Details Page'
    }
    // {
    //     path: 'details',
    //     component: Details,
    //     title: 'Details - Housing for All'
    // }
];

export default routeConfig;