// ==UserScript==
// @name        EnsimagZenithPlus
// @namespace   https://intranet.ensimag.fr/Zenith2/
// @description Amélioration du Zenith de l'ensimag
// @include     https://intranet.ensimag.fr/Zenith2/
// @include     https://intranet.ensimag.fr/Zenith2/ConsultNotes?uid=*
// @version     1
// @grant       none
// ==/UserScript==

/*
 * Auteur : Arthur Sonzogni
 * Contributeur :
 */

var ZP = {

    main : function() {
        if (document.URL.indexOf("ConsultNotes") != -1)
        {
            this.consultNote.run();
        }
        else
        {
            this.homePage.run();
        }
    },

    consultNote : {

        // attribut
        tableDOM : {},
        table : {},


        // methodes
        run : function() {
            this.parseTable();
        },

        parseTable : function() {
            this.table=document.getElementsByTagName("table");
            var tr = this.table[0].getElementsByTagName("tr");
            var nbNotes = tr.length;
            var SumNotes = 0;
            var SumCoef = 0;
            for( var i = 0; i<nbNotes ; i++)
            {
                alert("i="+i);
            }
        }
        

    },

    homePage : {
        
        run : function() {

        },
    },
};

ZP.main();
