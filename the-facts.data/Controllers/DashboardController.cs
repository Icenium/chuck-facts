using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace the_facts.data.Controllers
{
    public class DashboardController : ApiController
    {
        readonly Repositories.DashboardRepository _repository = new Repositories.DashboardRepository();

        public object Get() {
            return _repository.Get();
        }
    }
}
