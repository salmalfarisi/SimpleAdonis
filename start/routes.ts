/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer''
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async ({ session, view, response }) => {
	if(session.get('id') != null)
	{
		response.redirect().toRoute('ArticlesController.Index');
	}
	else
	{
		return view.render('welcome')		
	}
})

Route.group(() => {
	Route.get('/login', 'AccountsController.Login').as('IndexLogin')
	Route.post('/login/post', 'AccountsController.PostLogin').as('PostLogin')
	Route.get('/registration', 'AccountsController.Registration').as('IndexRegistration')
	Route.post('/registration/post', 'AccountsController.PostRegistration').as('PostRegistration')
	Route.get('/logout', 'AccountsController.Logout').as('Logout').middleware('auth')
})

Route.group(() => {
	Route.get('/index', 'ArticlesController.Index').as('Article.index')
	Route.get('/create', 'ArticlesController.Create').as('Article.create')
	Route.post('/store', 'ArticlesController.Store').as('Article.store')
	Route.get('/edit/:id', 'ArticlesController.Edit').as('Article.edit')
	Route.post('/update/:id', 'ArticlesController.Update').as('Article.update')
	Route.get('/destroy/:id', 'ArticlesController.Destroy').as('Article.destroy')
}).prefix('/article').middleware('auth')