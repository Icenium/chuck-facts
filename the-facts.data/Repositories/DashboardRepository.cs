using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace the_facts.data.Repositories {
    public class DashboardRepository {

        readonly ChuckNorrisEntities _entities = new ChuckNorrisEntities();

        public object Get() {

            // not the most efficient query - this would be better as a stored procedure with a common table expression (CTE)
            decimal count = _entities.Jokes.Count();

            decimal nerdy = (from t in _entities.Categories
                         where t.CategoryId == 0
                         select t.Jokes.Count()).FirstOrDefault();

            decimal xplicit = (from t in _entities.Categories
                          where t.CategoryId == 1
                          select t.Jokes.Count()).FirstOrDefault();

            decimal funny = (from t in _entities.Categories
                        where t.CategoryId == 2
                        select t.Jokes.Count()).FirstOrDefault();

            return new List<object> {
                new { category = "nerdy", value = (nerdy / count) * 100 },
                new { category = "explicit", value = (xplicit / count) * 100 },
                new { category = "funny", value = (funny / count) * 100 }
            };

        }
    }

}