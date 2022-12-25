import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class Auth {
  public async handle({ session, response }: HttpContextContract, next: () => Promise<void>) {
    // code for middleware goes here. ABOVE THE NEXT CALL
	const ids = session.get('id');
	if(ids == null)
	{
		response.redirect('/');
	}
	else
	{
		await next()
	}
  }
}
