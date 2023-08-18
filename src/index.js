const express = require("express");
const cors = require("cors");
const cron = require("node-cron");
const sgtconnect = require("./config/database");

const transporter = require("./config/mail");

const message = require("./template");
const { format } = require("date-fns");
const app = express();
app.use(cors());
app.use(express.json());

app.get("/:month", async (req, res) => {
  const { month } = req.params;
  const [
    data,
    metadata,
  ] = await sgtconnect.query(`select nome, data_nascimento as date, descricao from gr_pessoa g 
    inner join rh_departamento d on g.rh_departamento_id = d.id
    where g.gr_perfil_pessoa = 2 and g.ativo = true and d.ativo and to_char(data_nascimento, 'MM') = '${month}'
    and g.rh_situacao_empregado in (1,2,7,8,10) and g.matricula < '5000' and g.rh_departamento_id not in (65) order by to_char(data_nascimento,'MM-DD') asc`);
  return res.json(data);
});

cron.schedule("0 0 0 * * *", async () => {


  let mails = [];
  const date = format(new Date(), 'MM-dd')
  const [data, metadata] = await sgtconnect.query(`
    select email from gr_pessoa g 
          inner join rh_departamento d on g.rh_departamento_id = d.id
    where 
            g.gr_perfil_pessoa = 2 and 
            g.ativo = true and 
            d.ativo and
            g.rh_situacao_empregado in (1,2,7,8,10) and 
            g.matricula < '5000' and
            to_char(g.data_nascimento, 'MM-DD') = '${date}'  and
            g.rh_departamento_id not in (65) 
   `);

      
  data.map((element) =>{
    mails.push(element.email)
  })

  await transporter.sendMail({
    from: '"Expresso figueiredo Ltda" <sistemas@grupofigueiredo.com.br>', // sender address
    to: mails, // list of receivers
    subject: "Feliz Aniversário", // Subject line
    html: message, // html body
    attachments: [
      {
        filename: "banner",
        path: __dirname + "/images/send.png",
        cid: "banner",
      },
    ],
  });

  mails = [];
});

app.post('/sendmail', async (request, response) =>{

    const { from, to, subject, html } = request.body
    await transporter.sendMail({
    from,
    to,
    subject,
    html,
  });
  
  return response.json('ok');

})

app.listen(3434, () => console.log("server started"));
