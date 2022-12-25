"use strict";
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { schema, rules } from '@ioc:Adonis/Core/Validator';
import User from 'App/Models/User';
import Hash from '@ioc:Adonis/Core/Hash';
import Database from '@ioc:Adonis/Lucid/Database'

export default class AccountsController {
	async Login({ session, view, response })
	{
		if(session.get('id') != null)
		{
			response.redirect().toRoute('ArticlesController.Index');
		}
		else
		{
			return view.render("content.user.login");
		}
	}
	
	async PostLogin({ auth, session, request, response })
	{
		const checkexist = await auth.use('web').attempt(request.input('email'), request.input('password'));

		const user = await User
			.query()
			.where('email', request.input('email'))
			.firstOrFail()

		// Verify password
		if (await Hash.verify(user.password, request.input('password')))
		{
			const result = await auth.use('web').login(user);
			session.put('id', user.id);
			session.put('name', user.name);
			session.put('email', user.email);
		
			session.flash('success', 'Successfully Login');
			response.redirect().toRoute('ArticlesController.Index');
		}
		else
		{
			session.flash('danger', 'Username or password not found in database');
			response.redirect().back();
		}
	}
	
	async Registration({ session, view, response })
	{
		if(session.get('id') != null)
		{
			response.redirect().toRoute('ArticlesController.Index');
		}
		else
		{
			return view.render("content.user.register");
		}
	}
	
	async PostRegistration({ session, request, response })
	{
		/**
		   * Step 1 - Define schema
		*/   
		const newUserSchema = schema.create({
			name: schema.string([
				rules.required(),
			]),
			email: schema.string([
				rules.required(),
				rules.email(),
				rules.unique({table:'users', column:'email'}),
			]),
			password: schema.string([
			  rules.required(),
			]),
			password_confirmation: schema.string([
			  rules.required(),
			  rules.confirmed('password'),
			])
		  })

		const trx = await Database.transaction();
		try {
			/**
			 * Step 2 - Validate request body against
			 *          the schema
			 */
			const payload = await request.validate({
			  schema: newUserSchema
			});
			
			var settime = new Date();
			var now = settime.getFullYear() + '-' + settime.getMonth() + '-' + settime.getDate() + " " + settime.getHours() + ":" + settime.getMinutes() + ":" + settime.getSeconds();
			const password = await Hash.make(request.input('password'));
			const newdata = {
				email : request.input('email'),
				name : request.input('name'),
				password : password,
				created_at : now,
			}
			
			await trx
			  .insertQuery()
			  .table('users')
			  .insert(newdata);
			
			await trx.commit();
			
			session.flash('success', 'User successfully created');
			response.redirect().back();
		} catch (error) {
			/**
			 * Step 3 - Handle errors
			 */
			await trx.rollback();
			let errors = error.messages;
			console.log(error);
			for (const key in errors) {
				session.flash(key, errors[key]);
			}
			response.redirect().back();
		}
	}
	
	async Logout({ session, auth, response })
	{
		await auth.use('web').logout();
		session.clear();
		response.redirect('/');
	}
}
