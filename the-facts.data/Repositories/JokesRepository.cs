using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace the_facts.data.Repositories {
    public class JokesRepository {

        readonly ChuckNorrisEntities _entities = new ChuckNorrisEntities();

        public Models.Joke Random(string jokeCategory) {
            var jokes = Get();
            return jokes.Where(c => c.Category.Description == jokeCategory)
                .OrderBy(x => Guid.NewGuid())
                .Take(1).FirstOrDefault();
        }

        public IQueryable<Models.Joke> Get() {

            return _entities.Jokes.Select(j => new Models.Joke {
                JokeId = j.JokeId,
                JokeText = j.JokeText,
                Category = j.Categories.Select(c => new Models.Category {
                    CategoryId = c.CategoryId,
                    Description = c.Description
                }).FirstOrDefault()
            });

        }
    }
}