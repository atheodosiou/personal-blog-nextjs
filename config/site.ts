import Timeline, { TimelineItem } from "@/components/work-timeline";

export const siteConfig = {
  name: "Anastasios Theodosiou",
  url: "https://anastasios.theodosiou.me",
  description:
    "Hi there! 😊 I’m a Senior Frontend Engineer with a passion for Angular and building seamless web experiences. Welcome to my corner of the internet! Explore my work, ideas, and journey in crafting modern, user-centric applications. I’m thrilled to have you here! 🚀",
  author: "Anastasios Theodosiou",
  email: "anastasios.theodosiou@gmai.com",
  links: {
    github: "https://github.com/atheodosiou",
    linkedin: "https://www.linkedin.com/in/anastasios-theodosiou",
    arhsHellas: "https://www.arhs-group.com/entities/developments-hellas",
    devto: "https://dev.to/atheodosiou",
    personalSite: "",
  },
  placeOfBirth:
    "https://www.google.com/maps/place/%CE%91%CE%BB%CE%B5%CE%BE%CE%B1%CE%BD%CE%B4%CF%81%CE%BF%CF%8D%CF%80%CE%BF%CE%BB%CE%B7+681+00/@40.8429547,25.8404621,12.75z/data=!4m5!3m4!1s0x14b21c9f5c02c8d5:0xbab0f92b441e41e3!8m2!3d40.8457193!4d25.873962",
  placeOfWork:
    "https://www.google.com/maps/place/%CE%98%CE%B5%CF%83%CF%83%CE%B1%CE%BB%CE%BF%CE%BD%CE%AF%CE%BA%CE%B7/@40.6169853,22.9703081,12z/data=!4m6!3m5!1s0x14a838f41428e0ed:0x9bae715b8d574a9!8m2!3d40.6400629!4d22.9444191!16zL20vMGIybWM?entry=ttu",
};

export type SiteConfig = typeof siteConfig;

export const workExperienceAndEducationInfo: {
  experience: TimelineItem[];
  education: TimelineItem[];
} = {
  experience: [
    {
      title: "Senior Front-End Engineer",
      company: "ARHS Developments Hellas · Full-time · Remote",
      date: "Jun 2022 - Present",
      description: `
      As a Senior Frontend Engineer with expertise in Angular 16, I lead frontend development efforts for UNFCCC projects such as the extension of the eConsilium ecosystem for the European Council's Single Resolution Mechanism (SRM) and the development of features for the SAMS-Sysper TIM MVP for the Council of EU. My responsibilities include architecting frontend solutions, designing and implementing complex UI features, integrating with backend APIs on Microsoft Power Apps and Azure, ensuring cross-browser compatibility and frontend performance optimization. I provide technical guidance to junior developers, collaborate with backend teams, implement agile methodologies, conduct code reviews, and stay updated with Angular features and industry trends. Additionally, I analyze and prototype enhancements for existing applications, develop solutions, and provide user support while also creating functional and technical specification documents.

      Roles & Responsibilities:

      Leading frontend development efforts
      Designing and implementing UI features
      Integrating with backend APIs
      Ensuring cross-browser compatibility and performance optimization
      Providing technical guidance and mentoring
      Collaborating with backend teams
      Implementing agile methodologies
      Conducting code reviews and troubleshooting
      Staying updated with Angular and industry trends
      Analyzing and prototyping enhancements
      Developing solutions and providing user support
      Writing functional and technical specification documents.
      `,
    },
    {
      title: "Senior Front-End Developer",
      company: "Netcompany-Intrasoft · Full-time · Hybrid",
      date: "Jul 2020 - Jun 2022",
      description: `
      Design, develop and maintain EU projects. Working with Angular version 11 and 12. 
      EU projects:
      CRMS2: The EU Customs Risk Management System (CRMS) is an electronic system linking national risk analysis centers and all external border control points in the EU and the Commission. The system facilitates the systematic exchange of risk information and wide-ranging communication among Member States, underpinning the common framework for risk management of the supply chain for security and safety purposes.
      CSMIS
      ICS2
      `,
    },
    {
      title: "Front-End Developer",
      company: "OR-CO Organization And Computing · Full-time",
      date: "Mar 2018 - Jul 2020",
      description: `
      I worked as a front-end developer using Angular 7, typescript, Primefaces/PrimeNG to build solutions in the field of healthcare informatics. I am involved in the development process of a number of web applications for public hospitals throughout Greece. 
      They were either rebuilt based on existing implementation ( Powerbuilder ) or created from scratch (using Angular v7 and JavaEE).

      Key Responsibilities included but were not limited to:
      - Delegating tasks and setting for internal Front- End team (gitscrum).
      - Setting up the Front-End development environment (Angular 7) and processes ( Team of 3 Front-End developer and 3 Full-stack )
      - Researching and selecting helpful Libraries and Frameworks
      - Developing Components, by following modular logic and principles, which would be used by the rest of the developers throughout all apps.

      Used: Angular 7+, TypeScript, Karma, Jasmine, Websockets, PWA, Material2, Flexlayout, PrimeNG, CSS3, Html5, PrimeNG
      `,
    },
    {
      title: "Front-End Developer",
      company: "Freelance, self-employed · Part-time",
      date: "Jun 2016 - Mar 2018",
      description: "HTML CSS JAVASCRIPT, ANGULAR, NODEJS, EXPRESS, MONGODB",
    },
  ],
  education: [
    {
      title: "Aristotle University of Thessaloniki · AUTH",
      company: "MSc, Data and Web Sience · Grade: 9.3/10",
      description: `
      Master Thesis: Distributed Link Prediction in Large Scale Graphs using Apache Spark 
      The purpose of this master diploma thesis is to create models and experiment with various techniques of machine learning, both supervised and unsupervised, in order to predict links to a network of academic papers using document-based similarity metrics based on the characteristics of the nodes but also other on other structural features, of the network. Experimentation and implementation of the application took place using Apache Spark to manage the large data volume using the Scala programming language. 
      Remarkable master courses could be found below.
      Courses:
      Minning from Massive Datasets (Based on CS246 course of Stanford University)
      Technologies for Big Data Management and Analytics
      Web Mining and Information Retrieval
      Social Network Analysis
      Advanced Topics in Distributed Processing
      Internet of Services and Things (IoT)
      Semantic Web
      Economic and Business Processes in the Web
      `,
      date: "2017 - 2019",
    },
    {
      title:
        "Technological Educational Institute of Thessaly · TEI of Thessaly",
      company: "BSc on Computer Science and Telecommunications · Grade 7.66/10",
      description: `
      Thesis: FuelGR is a map-based application about fuel stations and prices of the Greek market. It receives data from the Fuel Prices Observatory (a Greek State organization where fuel station owners register their prices), and enhances it with geolocation data. The user can filter out the information he receives based on multiple criteria, have direct access to the three cheapest stations, can get driving directions to the selected station, etc. fuelGR can be easily used by non-Greek speakers and will be useful to anyone moving around Greece by car.`,
      date: "2010 - 2014",
    },
  ],
};

export type ExperienceEducation = typeof workExperienceAndEducationInfo;
