"use strict";
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { schema, rules } from '@ioc:Adonis/Core/Validator';
import Article from 'App/Models/Article';
import Database from '@ioc:Adonis/Lucid/Database';
import Application from '@ioc:Adonis/Core/Application';

export default class ArticlesController {
	async Index({ request, session, view })
	{
		const page = request.input('page', parseInt('1'));
		const limit = parseInt('20');
	
		const data = await Database
		  .query()
		  .from('articles')
		  .select('*')
		  .where('user_id', session.get('id'))
		  .where('delete_status', false)
		  .paginate(page, limit);
		  
		data.baseUrl('/article/index');
		
		return view.render("content.article.index", { data });
	}
	
	async Create({ view })
	{
		const formdata = new Article();
		return view.render("content.article.form", { formdata });
	}
	
	async Store({ session, request, response })
	{
		const checkschema = schema.create({
			title: schema.string([
				rules.required(),
			]),
			description: schema.string([
				rules.string(),
			]),
			image: schema.file({
				required:true,
				size:'2mb',
				extnames: ['jpg', 'png', 'jpeg'],
			}),
		})
	
		const trx = await Database.transaction();
		try {
			/**
			 * Step 2 - Validate request body against
			 *          the schema
			 */
			 
			const payload = await request.validate({
			  schema: checkschema
			});
			
			var settime = new Date();
			var now = settime.getFullYear() + '-' + settime.getMonth() + '-' + settime.getDate() + " " + settime.getHours() + ":" + settime.getMinutes() + ":" + settime.getSeconds();
			
			const newfile = request.file('image');
			var setname = "article-" + Math.floor(Math.random() * 999999) + "." + newfile.extname;			
			
			const newdata = {
				title : request.input('title'),
				description : request.input('description'),
				user_id : session.get('id'),
				delete_status : false,
				image: setname,
				created_at : now,
			}
			
			await payload.image.moveToDisk('images', {
			  name: setname,
			  overwrite: false, // overwrite in case of conflict
			})
			
			await trx
			  .insertQuery()
			  .table('articles')
			  .insert(newdata);
			
			await trx.commit();
			
			session.flash('success', 'Articles successfully created');
			response.redirect().toRoute('ArticlesController.Index');
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
	
	async Edit({ request, response, view })
	{
		const formdata = await Database
			.from('articles')
			.where('id', request.param('id'))
			.first();
			
		return view.render("content.article.form", { formdata });
	}
	
	async Update({ session, request, response })
	{
		const checkschema = schema.create({
			title: schema.string([
				rules.required(),
			]),
			description: schema.string([
				rules.string(),
			]),
			image: schema.file.optional({
				size:'2mb',
				extnames: ['jpg', 'png', 'jpeg', 'JPG', 'PNG', 'JPEG'],
			}),
		})
	
		const trx = await Database.transaction();
		try {
			/**
			 * Step 2 - Validate request body against
			 *          the schema
			 */
			const payload = await request.validate({
			  schema: checkschema
			});
			
			var settime = new Date();
			var now = settime.getFullYear() + '-' + settime.getMonth() + '-' + settime.getDate() + " " + settime.getHours() + ":" + settime.getMinutes() + ":" + settime.getSeconds();
			
			const newdata = {
				title : request.input('title'),
				description : request.input('description'),
				updated_at : now,
			}
			
			const newfile = request.file('image');
			if(newfile != null)
			{
				var setname = "article-" + Math.floor(Math.random() * 999999) + "." + newfile.extname;
				await payload.image.moveToDisk('images', {
				  name: setname,
				  overwrite: false, // overwrite in case of conflict
				})
				newdata.image = setname;
			}			
			
			await trx
			  .from('articles')
			  .where('id', request.param('id'))
			  .update(newdata);
			
			await trx.commit();
			
			session.flash('success', 'Articles successfully update');
			response.redirect().toRoute('ArticlesController.Index');
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
	
	async Destroy({ request, response })
	{
		const trx = await Database.transaction();
		try {
			/**
			 * Step 2 - Validate request body against
			 *          the schema
			 */
			var settime = new Date();
			var now = settime.getFullYear() + '-' + settime.getMonth() + '-' + settime.getDate() + " " + settime.getHours() + ":" + settime.getMinutes() + ":" + settime.getSeconds();
			
			const newdata = {
				delete_status : true,
			}
			
			await trx
			  .from('articles')
			  .where('id', request.param('id'))
			  .update(newdata);
			
			await trx.commit();
			
			session.flash('success', 'Articles successfully delete');
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
}
