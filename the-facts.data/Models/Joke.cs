using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace the_facts.data.Models {
    public class Joke {
        public int JokeId { get; set; }
        public string JokeText { get; set; }
        public Models.Category Category { get; set; }
    }
}