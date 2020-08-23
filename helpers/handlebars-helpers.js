const moment = require('moment');
const snippets = require("smart-text-snippet");
const htmlToText = require("html-to-text");
// const { parse } = require("node-html-parser");


module.exports = {

    select: function(selected, options){
        return options.fn(this).replace(new RegExp(' value=\"'+ selected + '\"'), '$&selected="selected"');
    },


    generateDate: function(date, format){
        return moment(date).format(format);
    },


    smartText: function(text){
       return snippets.snip(text, {len: 150});
    },

    html_text: function(html_text){
        return htmlToText.fromString(html_text, {wordwrap: 150});
     },

     stripTags: function (input) {
        return input.replace(/<(?:.|\n)*?>/gm, '')
      },

      
    truncate: function (str, len) {
        if (str.length > len && str.length > 0) {
          let new_str = str + ' '
          new_str = str.substr(0, len)
          new_str = str.substr(0, new_str.lastIndexOf(' '))
          new_str = new_str.length > 0 ? new_str : str.substr(0, len)
          return new_str + '...'
        }
        return str
      },



    paginate: function(options){



        console.log(options.hash.current)
        let output = '';
        if(options.hash.current === 1){
            output += `<li class="page-item disabled"><a class="page-link">First</a></li>`;
            // output += `
            //     <li class="page-item">
            //         <a href="#" class="page-link" aria-label="Previous">
            //             <i class="ti-angle-left"></i>
            //         </a>
            //     </li>`;

        } else {
            output += `<li class="page-item"><a href="?page=1" class="page-link">First</a></li>`;
        }



        let i = (Number(options.hash.current) > 5 ? Number(options.hash.current) - 4 : 1);

        if(i !== 1){
            output += `<li class="page-item disabled"><a class="page-link">...</a></li>`;
        }

        for(; i <= (Number(options.hash.current) + 4) && i <= options.hash.pages; i++){
            if(i === options.hash.current){
                output += `<li class="page-item active"><a class="page-link">${i}</a></li>`;

            }
            
            else {
                output += `<li class="page-item "><a href="?page=${i}" class="page-link">${i}</a></li>`;
            }


            if(i === Number(options.hash.current) + 4 && i < options.hash.pages){
                output += `<li class="page-item disabled"><a class="page-link">...</a></li>`;
            }



        }


         if(options.hash.current === options.hash.pages) {


             output += `<li class="page-item disabled"><a class="page-link">Last</a></li>`;


         } else {


             output += `<li class="page-item "><a href="?page=${options.hash.pages}" class="page-link">Last</a></li>`;


         }


        return output;



    }



};
