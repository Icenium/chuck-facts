using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace the_facts.data.Controllers
{
    public class JokesController : ApiController
    {
        readonly Repositories.JokesRepository _jokes = new Repositories.JokesRepository();

        public Models.Joke Get(string type) {

            return _jokes.Random(type);

        }
    }
}
