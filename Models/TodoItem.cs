using System;
using System.ComponentModel.DataAnnotations;

namespace sig_todo.Models
{
    public class TodoItem
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public bool IsComplete { get; set; }
        public long? ParentId { get; set; } // allow this to be nullable

        [DataType(DataType.Date)]
        public DateTime DeadlineDate { get; set; }
    }
}
