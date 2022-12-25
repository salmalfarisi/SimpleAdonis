import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Factory from '@ioc:Adonis/Lucid/Factory'
import User from 'App/Models/User'
import Article from 'App/Models/Article'
import Hash from '@ioc:Adonis/Core/Hash'
import random from 'random-name'

export default class extends BaseSeeder {
  public async run () {
    // Write your database queries inside the run method
	await Article.truncate('CASCADE')
	await User.truncate('CASCADE')
	
	let array = [];
	for (let i = 0; i < 10; i++) {
		let temp = random.first();
		array.push(temp);
	}
	
	for (var i = 0; i < array.length; i++) {
		let index = array[i];
		const user = new User()
		user.name = index
		user.email = index + '@email.com'
		user.password = await Hash.make(index)
		await user.save()
	}
  }
}
