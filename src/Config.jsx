export const fieldsConfig = [
    { 
        title: "Year of Graduation", 
        field: "ks_optionyearlist", 
        type: "lookup", 
        showType: "multiselect", 
        hide: false,
        lookupConfig: { 
            entityName: "ks_optionyearlist", 
            primaryName: "ks_name", 
            primaryIDName: "ks_optionyearlistid", 
        },
        linkEntityConfig: {
            isLinkEntity: true,
            to: "contactid",
            from: "ks_academicrecordslookupid",
            alias: "ac",
            linkEntityName: "ks_academicrecord"
        }
    },
    { 
        title: "Faculty/ School", 
        field: "ks_facultyschooloptionsenglish", 
        type: "lookup", 
        showType: "multiselect", 
        hide: false,
        lookupConfig: { 
            entityName: "ks_facultyschooloptionsenglish", 
            primaryName: "ks_name", 
            primaryIDName: "ks_facultyschooloptionsenglishid", 
        },
        linkEntityConfig: {
            isLinkEntity: true,
            to: "contactid",
            from: "ks_academicrecordslookupid",
            alias: "ac",
            linkEntityName: "ks_academicrecord"
        }
    },
    { 
        title: "Department", 
        field: "ks_optiondepartment", 
        type: "lookup", 
        showType: "multiselect", 
        hide: false,
        lookupConfig: { 
            entityName: "ks_optiondepartmentenglish", 
            primaryName: "ks_name", 
            primaryIDName: "ks_optiondepartmentenglishid", 
        },
        linkEntityConfig: {
            isLinkEntity: true,
            to: "contactid",
            from: "ks_academicrecordslookupid",
            alias: "ac",
            linkEntityName: "ks_academicrecord"
        }
    },
    { 
        title: "Degree", 
        field: "ks_degree", 
        type: "lookup", 
        showType: "multiselect", 
        hide: false,
        lookupConfig: { 
            entityName: "ks_optionalumnidegreeselection", 
            primaryName: "ks_name", 
            primaryIDName: "ks_optionalumnidegreeselectionid", 
        },
        linkEntityConfig: {
            isLinkEntity: true,
            to: "contactid",
            from: "ks_academicrecordslookupid",
            alias: "ac",
            linkEntityName: "ks_academicrecord"
        }
    },
    { 
        title: "Program title", 
        field: "ks_programtitlelookup", 
        type: "lookup", 
        showType: "multiselect", 
        hide: false,
        lookupConfig: { 
            entityName: "ks_optionprogrammetitle", 
            primaryName: "ks_name", 
            primaryIDName: "ks_optionprogrammetitleid", 
        },
        linkEntityConfig: {
            isLinkEntity: true,
            to: "contactid",
            from: "ks_academicrecordslookupid",
            alias: "ac",
            linkEntityName: "ks_academicrecord"
        }
    },
    { 
        title: "Sur Name", 
        field: "lastname", 
        type: "string", 
        showType: "text",
        hide: false,
        linkEntityConfig: {
            isLinkEntity: false,
            to: "",
            from: "",
            alias: "",
            linkEntityName: ""
        }
    },
    { 
        title: "Given Name", 
        field: "firstname", 
        type: "string", 
        showType: "text",
        hide: false,
        linkEntityConfig: {
            isLinkEntity: false,
            to: "",
            from: "",
            alias: "",
            linkEntityName: ""
        }
    },
    { 
        title: "Chinese Name", 
        field: "ks_chinesename", 
        type: "string", 
        showType: "text",
        hide: false,
        linkEntityConfig: {
            isLinkEntity: false,
            to: "",
            from: "",
            alias: "",
            linkEntityName: ""
        }
    },
    { 
        title: "Preferred Name", 
        field: "ks_preferredname", 
        type: "string", 
        showType: "text",
        hide: false,
        linkEntityConfig: {
            isLinkEntity: false,
            to: "",
            from: "",
            alias: "",
            linkEntityName: ""
        }
    },
    { 
        title: "Mobile Phone", 
        field: "mobilephone", 
        type: "string", 
        showType: "text",
        hide: false,
        linkEntityConfig: {
            isLinkEntity: false,
            to: "",
            from: "",
            alias: "",
            linkEntityName: ""
        }
    },
    {
        title: "Email", 
        field: "emailaddress1", 
        type: "string", 
        showType: "text",
        hide: false,
        linkEntityConfig: {
            isLinkEntity: false,
            to: "",
            from: "",
            alias: "",
            linkEntityName: ""
        }
    },
    { 
        title: "Current Country", 
        field: "ks_currentcountry", 
        type: "lookup", 
        showType: "multiselect", 
        hide: false,
        lookupConfig: { 
            entityName: "ks_optioncountryenglish", 
            primaryName: "ks_name", 
            primaryIDName: "ks_optioncountryenglishid", 
        },
        linkEntityConfig: {
            isLinkEntity: false,
            to: "",
            from: "",
            alias: "",
            linkEntityName: ""
        }
    },
    {
        title: "Company Name", 
        field: "ks_companyname", 
        type: "string", 
        showType: "text",
        hide: false,
        linkEntityConfig: {
            isLinkEntity: false,
            to: "",
            from: "",
            alias: "",
            linkEntityName: ""
        }
    },
    { 
        title: "Title", 
        field: "ks_titleoptionsenglish", 
        type: "lookup", 
        showType: "multiselect", 
        hide: false,
        lookupConfig: { 
            entityName: "ks_optiontitleenglish", 
            primaryName: "ks_name", 
            primaryIDName: "ks_optiontitleenglishid", 
        },
        linkEntityConfig: {
            isLinkEntity: false,
            to: "",
            from: "",
            alias: "",
            linkEntityName: ""
        }
    }
]

export const EntityName = "contact"