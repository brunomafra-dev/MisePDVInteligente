export type LegalTable = {
  headers: string[];
  rows: string[][];
};

export type LegalSection = {
  title: string;
  body?: string[];
  bullets?: string[];
  table?: LegalTable;
};

export type LegalDocument = {
  title: string;
  eyebrow: string;
  summary: string;
  lastUpdated: string;
  reviewNotice: string;
  sections: LegalSection[];
};

const lastUpdated = "7 de maio de 2026";
const reviewNotice =
  "Minuta operacional para revisao juridica. Antes de publicar em producao, preencher razao social, CNPJ, endereco, e-mail oficial de privacidade, foro e dados do encarregado.";

export const termsOfUse: LegalDocument = {
  title: "Termos de Uso do Mise",
  eyebrow: "Contrato de licenca SaaS",
  summary:
    "Regras para uso do Mise por restaurantes, pizzarias, lanchonetes, food trucks e outros negocios de alimentacao.",
  lastUpdated,
  reviewNotice,
  sections: [
    {
      title: "1. Partes e aceite",
      body: [
        "Estes Termos regulam o uso do Mise PDV Inteligente, produto mantido por [RAZAO SOCIAL A DEFINIR], [CNPJ A DEFINIR], com sede em [ENDERECO A DEFINIR].",
        "Ao criar conta, acessar a demonstracao, contratar plano, utilizar o sistema ou permitir que colaboradores usem o Mise, o contratante declara que leu, entendeu e aceitou estes Termos.",
        "O contratante deve ter poderes para representar o restaurante, unidade, marca, MEI, empresa ou pessoa juridica que utilizara o sistema.",
      ],
    },
    {
      title: "2. Objeto do servico",
      body: [
        "O Mise e uma plataforma SaaS online para apoio a operacao de servicos de alimentacao, incluindo PDV, mesas, comandas, delivery proprio, cozinha, estoque, ficha tecnica, relatorios, caixa, comunicacoes e integracoes.",
        "As funcionalidades podem variar conforme o plano contratado, estagio do produto, configuracao da unidade e disponibilidade de terceiros integrados.",
      ],
    },
    {
      title: "3. Licenca de uso",
      body: [
        "O contratante recebe uma licenca limitada, temporaria, nao exclusiva, revogavel e intransferivel para usar o Mise durante a vigencia da contratacao.",
        "Nenhum direito de propriedade intelectual, codigo-fonte, marca, layout, banco de dados estrutural, metodo, tecnologia ou documentacao tecnica e transferido ao contratante.",
      ],
    },
    {
      title: "4. Cadastro, usuarios e acessos",
      body: [
        "O contratante e responsavel por manter dados corretos, criar usuarios apenas para pessoas autorizadas, revisar permissoes e remover acessos de colaboradores que sairem da operacao.",
        "Login e senha sao pessoais. O compartilhamento de credenciais, uso de senhas fracas ou permanencia de acessos indevidos sao responsabilidade do contratante.",
      ],
      bullets: [
        "Administradores devem revisar cargos e permissoes periodicamente.",
        "Cada usuario deve acessar somente as funcoes necessarias para sua atividade.",
        "Suspeitas de acesso indevido devem ser comunicadas imediatamente ao Mise.",
      ],
    },
    {
      title: "5. Planos, cobranca e cancelamento",
      body: [
        "Os valores, modulos, limites e condicoes comerciais serao informados na proposta, pagina de planos, contrato comercial ou aceite eletronico.",
        "Recursos como KDS/cozinha, integracoes, WhatsApp, fiscal, unidades adicionais, implantacao local e treinamento podem ser cobrados separadamente.",
        "Custos externos de certificados digitais, API fiscal, Mercado Pago, Meta/WhatsApp, provedores de internet, equipamentos, impressoras e meios de pagamento nao estao incluidos, salvo previsao expressa em proposta.",
        "Em caso de inadimplencia, fraude, uso abusivo ou violacao destes Termos, o Mise podera limitar, suspender ou cancelar o acesso, preservando os direitos de defesa e comunicacao quando aplicavel.",
      ],
    },
    {
      title: "6. Responsabilidade operacional do restaurante",
      body: [
        "O Mise e ferramenta de apoio operacional. O contratante continua responsavel pela gestao do negocio, precos, cardapio, producao, atendimento, entregas, qualidade dos alimentos, estoque fisico, seguranca alimentar, treinamento de equipe e conferencia das informacoes lancadas.",
        "Relatorios, indicadores de CMV, alertas de validade e baixas de estoque dependem da qualidade dos cadastros, fichas tecnicas, lancamentos e contagens informadas pelo proprio contratante.",
      ],
    },
    {
      title: "7. Aviso fiscal, NFC-e e documentos nao fiscais",
      body: [
        "O Mise podera apoiar a emissao de NFC-e por provedor externo, bem como gerar contas, comandas, recibos, relatorios e documentos operacionais nao fiscais.",
        "O Mise nao substitui contador, consultoria fiscal, escritorio contabil, SEFAZ, prefeitura, certificado digital ou provedor fiscal.",
        "O contratante e exclusivamente responsavel por credenciamento, certificado digital, CSC/token, inscricao estadual, regime tributario, aliquotas, CFOP, NCM, regras de cancelamento, contingencia, guarda de XML/DANFE, recolhimento de tributos e cumprimento de obrigacoes fiscais, tributarias e acessorias.",
      ],
    },
    {
      title: "8. Integracoes e terceiros",
      body: [
        "O funcionamento de Mercado Pago, WhatsApp/Meta, Focus NFe, Supabase, Vercel, provedores de internet, gateways, APIs de delivery e outros terceiros depende das regras, disponibilidade, taxas e politicas desses fornecedores.",
        "Falhas, indisponibilidades, bloqueios, mudancas de preco, alteracoes de API ou suspensoes causadas por terceiros nao sao controladas pelo Mise.",
      ],
    },
    {
      title: "9. WhatsApp, marketing e comunicacoes",
      body: [
        "Mensagens de status, atendimento, campanha, recuperacao de cliente ou promocao devem respeitar a LGPD, as politicas da Meta/WhatsApp, regras de consentimento, opt-out e boas praticas contra spam.",
        "O contratante e responsavel por garantir que possui base legal adequada para contatar seus clientes e por atender pedidos de descadastro quando a comunicacao for promocional.",
      ],
    },
    {
      title: "10. Disponibilidade, manutencao e internet",
      body: [
        "A versao atual do Mise e web e online. Queda de internet, instabilidade de navegador, equipamento local, impressora, roteador, provedor ou energia podem afetar a operacao.",
        "O Mise podera realizar manutencoes, atualizacoes e melhorias. Nao ha garantia de operacao ininterrupta ou livre de erros, salvo SLA especifico contratado por escrito.",
      ],
    },
    {
      title: "11. Uso proibido",
      bullets: [
        "Usar o Mise para atividade ilegal, fraude, envio abusivo de mensagens ou violacao de direitos de terceiros.",
        "Inserir dados sensiveis desnecessarios, dados falsos, conteudo ofensivo, malware ou informacoes que nao tenham relacao com a operacao contratada.",
        "Tentar burlar limites, explorar vulnerabilidades, fazer engenharia reversa, copiar telas, clonar marca, revender acesso sem autorizacao ou prejudicar a infraestrutura.",
      ],
    },
    {
      title: "12. Dados, privacidade e seguranca",
      body: [
        "O tratamento de dados pessoais segue a Politica de Privacidade, a Politica de Cookies e, quando aplicavel, o Acordo de Tratamento de Dados.",
        "O Mise adotara medidas tecnicas e administrativas razoaveis para proteger dados, incluindo controle de acesso, segregacao por unidade, logs, protecao de credenciais e revisoes de seguranca.",
        "O contratante deve manter usuarios, senhas, dispositivos, rede local e permissoes sob controle adequado.",
      ],
    },
    {
      title: "13. Suporte, implantacao e treinamento",
      body: [
        "Suporte, implantacao local, treinamento e configuracoes assistidas poderao ser gratuitos ou cobrados conforme proposta comercial.",
        "O suporte nao inclui obrigacoes de contabilidade, configuracao de rede fisica, manutencao de impressoras, recuperacao de equipamentos, suporte de terceiros ou operacao direta do restaurante.",
      ],
    },
    {
      title: "14. Limitacao de responsabilidade",
      body: [
        "Na maxima extensao permitida pela lei, o Mise nao sera responsavel por lucros cessantes, perda de receita, perda de clientela, dano indireto, consequencial, punitivo ou prejuizo causado por uso incorreto, cadastro incorreto, falha de terceiros, ausencia de internet ou decisao operacional tomada exclusivamente pelo contratante.",
        "Eventual responsabilidade direta do Mise, quando comprovada, ficara limitada ao valor efetivamente pago pelo contratante nos ultimos 3 meses, salvo disposicao legal obrigatoria em sentido contrario.",
      ],
    },
    {
      title: "15. Alteracoes dos Termos",
      body: [
        "Estes Termos poderao ser atualizados para refletir mudancas legais, tecnicas, comerciais ou de produto. A data de atualizacao sera indicada nesta pagina.",
        "Quando a alteracao for relevante, o Mise podera comunicar por e-mail, aviso no sistema ou outro canal cadastrado.",
      ],
    },
    {
      title: "16. Lei aplicavel e foro",
      body: [
        "Estes Termos sao regidos pelas leis brasileiras. O foro sera [FORO A DEFINIR], salvo quando a legislacao aplicavel determinar regra obrigatoria diferente.",
      ],
    },
    {
      title: "17. Contato",
      body: [
        "Duvidas comerciais, suporte, seguranca ou privacidade devem ser enviadas para [EMAIL OFICIAL A DEFINIR].",
      ],
    },
  ],
};

export const privacyPolicy: LegalDocument = {
  title: "Politica de Privacidade do Mise",
  eyebrow: "LGPD e protecao de dados",
  summary:
    "Como o Mise coleta, usa, armazena, compartilha e protege dados pessoais no site, no app e nas integracoes.",
  lastUpdated,
  reviewNotice,
  sections: [
    {
      title: "1. Quem somos",
      body: [
        "Esta Politica se aplica ao Mise PDV Inteligente, produto mantido por [RAZAO SOCIAL A DEFINIR], [CNPJ A DEFINIR], com contato de privacidade em [EMAIL DE PRIVACIDADE A DEFINIR].",
        "Para dados de visitantes do site, leads, usuarios administrativos e contatos comerciais diretos, o Mise atua em regra como controlador.",
        "Para dados de clientes finais do restaurante inseridos pelo contratante no sistema, como nome, telefone, endereco de entrega e historico de pedidos, o restaurante e em regra o controlador e o Mise atua como operador, tratando os dados conforme instrucoes do restaurante e para prestar o servico contratado.",
      ],
    },
    {
      title: "2. Dados pessoais que podemos tratar",
      table: {
        headers: ["Categoria", "Exemplos"],
        rows: [
          ["Conta e acesso", "Nome, e-mail, senha criptografada, cargo, unidade, permissoes e logs de login."],
          ["Dados do restaurante", "Razao social, nome fantasia, CNPJ, endereco, telefone, configuracoes, mesas, cardapio e usuarios."],
          ["Operacao", "Pedidos, itens, pagamentos registrados, caixa, estoque, fichas tecnicas, lotes, validade e relatorios."],
          ["Clientes finais do restaurante", "Nome, telefone, endereco de entrega, observacoes do pedido e historico operacional."],
          ["Fiscal e pagamento", "Dados necessarios para NFC-e, status fiscal, identificadores de transacao e informacoes retornadas por provedores."],
          ["Comunicacoes", "Mensagens de suporte, notificacoes, templates de WhatsApp, preferencias e historico de atendimento."],
          ["Tecnicos e seguranca", "IP, dispositivo, navegador, eventos de erro, logs, cookies necessarios e identificadores de sessao."],
        ],
      },
    },
    {
      title: "3. Dados sensiveis",
      body: [
        "O Mise nao foi desenhado para tratar dados pessoais sensiveis. O contratante deve evitar inserir informacoes sobre saude, biometria, religiao, opiniao politica, vida sexual, origem racial ou outros dados sensiveis, salvo quando houver base legal clara e necessidade operacional real.",
      ],
    },
    {
      title: "4. Finalidades e bases legais",
      table: {
        headers: ["Finalidade", "Base legal usual"],
        rows: [
          ["Criar e manter conta, autenticar usuarios e prestar o SaaS", "Execucao de contrato ou procedimentos preliminares."],
          ["Processar pedidos, mesas, estoque, caixa, cozinha e relatorios", "Execucao de contrato e legitimo interesse operacional."],
          ["Emitir ou apoiar documentos fiscais por provedor externo", "Cumprimento de obrigacao legal/regulatoria e execucao de contrato."],
          ["Enviar notificacoes operacionais de pedido por WhatsApp/e-mail", "Execucao de contrato, legitimo interesse ou consentimento, conforme o caso."],
          ["Enviar marketing, campanhas e materiais comerciais do Mise", "Consentimento ou legitimo interesse, com opcao de descadastro quando aplicavel."],
          ["Prevenir fraude, proteger contas e auditar seguranca", "Legitimo interesse, cumprimento legal e exercicio regular de direitos."],
          ["Cumprir ordens legais, fiscais, judiciais ou reguladoras", "Cumprimento de obrigacao legal/regulatoria."],
        ],
      },
    },
    {
      title: "5. Compartilhamento com terceiros",
      body: [
        "Compartilhamos dados apenas quando necessario para prestar o servico, cumprir obrigacoes legais, proteger direitos, operar infraestrutura ou executar integracoes solicitadas pelo contratante.",
      ],
      table: {
        headers: ["Terceiro/categoria", "Uso esperado"],
        rows: [
          ["Supabase", "Banco de dados, autenticacao e servicos relacionados."],
          ["Vercel", "Hospedagem, distribuicao da aplicacao, logs tecnicos e infraestrutura."],
          ["Mercado Pago", "Checkout, pagamentos online, webhooks e status de transacao quando habilitado."],
          ["Meta/WhatsApp Business Platform", "Envio de mensagens utilitarias ou templates autorizados quando habilitado."],
          ["Focus NFe ou provedor fiscal equivalente", "Emissao, consulta e retorno de NFC-e quando habilitado."],
          ["Contabilidade, juridico, autoridades e seguranca", "Cumprimento legal, defesa de direitos, auditoria e resposta a incidentes."],
        ],
      },
    },
    {
      title: "6. Transferencia internacional",
      body: [
        "Alguns provedores de infraestrutura e integracao podem armazenar ou processar dados fora do Brasil. Quando isso ocorrer, o Mise buscara utilizar fornecedores com medidas contratuais, tecnicas e organizacionais adequadas ao nivel de risco e as exigencias da LGPD.",
      ],
    },
    {
      title: "7. Retencao e eliminacao",
      table: {
        headers: ["Tipo de dado", "Periodo esperado"],
        rows: [
          ["Dados de conta e contrato", "Enquanto houver relacao contratual e pelo prazo necessario para cumprimento legal, fiscal, cobranca ou defesa de direitos."],
          ["Dados operacionais do restaurante", "Enquanto a conta estiver ativa ou conforme configuracao/exportacao contratada, respeitados prazos legais aplicaveis."],
          ["Registros de acesso e seguranca", "Pelo periodo necessario para seguranca, auditoria e cumprimento do Marco Civil da Internet, quando aplicavel."],
          ["Leads e contatos comerciais sem contratacao", "Ate 180 dias apos a ultima interacao ou ate pedido de exclusao/descadastro, salvo base legal para retencao."],
          ["Backups", "Podem permanecer por periodo tecnico limitado ate rotacao segura, sem uso ativo ordinario."],
        ],
      },
    },
    {
      title: "8. Direitos dos titulares",
      body: [
        "Nos termos da LGPD, titulares podem solicitar confirmacao de tratamento, acesso, correcao, anonimizacao, bloqueio ou eliminacao de dados desnecessarios, portabilidade, informacao sobre compartilhamentos, revisao de decisoes automatizadas quando aplicavel, revogacao de consentimento e oposicao a tratamento irregular.",
        "Quando o pedido envolver dados de cliente final de um restaurante, o Mise podera direcionar o pedido ao restaurante controlador ou atuar em apoio ao atendimento, conforme o caso.",
      ],
    },
    {
      title: "9. Cookies e tecnologias similares",
      body: [
        "Usamos cookies necessarios para login, seguranca e funcionamento do app. Cookies analiticos ou de marketing, quando usados, deverao respeitar a Politica de Cookies e controles de consentimento quando exigidos.",
      ],
    },
    {
      title: "10. Seguranca da informacao",
      body: [
        "O Mise adota medidas tecnicas e administrativas proporcionais ao porte e ao risco, incluindo autenticacao, segregacao por unidade, controles de acesso, variaveis de ambiente para segredos, validacao de payloads, rate limiting e revisoes de seguranca.",
        "Nenhuma plataforma e absolutamente imune a incidentes. Caso ocorra incidente que possa gerar risco ou dano relevante, o Mise avaliara o impacto, adotara medidas de mitigacao e comunicara os envolvidos conforme a LGPD e normas da ANPD.",
      ],
    },
    {
      title: "11. Criancas e adolescentes",
      body: [
        "O Mise nao e direcionado a criancas. O contratante deve evitar cadastrar dados de criancas ou adolescentes no sistema, salvo quando indispensavel para a operacao e amparado por base legal adequada.",
      ],
    },
    {
      title: "12. Contato do encarregado",
      body: [
        "Pedidos de titulares, duvidas de privacidade e comunicacoes de protecao de dados devem ser enviados para [EMAIL DE PRIVACIDADE A DEFINIR]. O encarregado/DPO sera indicado nesta pagina antes da operacao comercial definitiva.",
      ],
    },
    {
      title: "13. Atualizacoes",
      body: [
        "Esta Politica podera ser atualizada para refletir mudancas de produto, lei, fornecedores, integracoes ou praticas de seguranca. A data de atualizacao sera indicada no topo da pagina.",
      ],
    },
  ],
};

export const cookiePolicy: LegalDocument = {
  title: "Politica de Cookies do Mise",
  eyebrow: "Cookies e tecnologias similares",
  summary:
    "Quais cookies e tecnologias semelhantes podem ser usados no site e no app Mise.",
  lastUpdated,
  reviewNotice,
  sections: [
    {
      title: "1. O que sao cookies",
      body: [
        "Cookies sao pequenos arquivos ou identificadores usados pelo navegador para lembrar sessoes, preferencias, seguranca e interacoes. Tecnologias similares incluem local identifiers, pixels, tags e registros tecnicos de acesso.",
      ],
    },
    {
      title: "2. Categorias usadas",
      table: {
        headers: ["Categoria", "Finalidade", "Obrigatorio?"],
        rows: [
          ["Necessarios", "Login, sessao, seguranca, roteamento, protecao contra abuso e funcionamento basico.", "Sim"],
          ["Preferencias", "Lembrar escolhas de interface, unidade, filtros ou configuracoes.", "Quando habilitado"],
          ["Analiticos", "Medir uso agregado, erros, desempenho e paginas acessadas.", "Somente com base legal adequada"],
          ["Marketing", "Mensurar campanhas, leads e conversoes comerciais.", "Somente com consentimento quando exigido"],
          ["Terceiros", "Recursos de provedores como pagamentos, WhatsApp, mapas, antifraude ou analytics.", "Depende do recurso"],
        ],
      },
    },
    {
      title: "3. Cookies no app autenticado",
      body: [
        "No ambiente autenticado, cookies e tecnologias equivalentes podem ser indispensaveis para manter sessao segura, autenticar usuario, evitar fraude e operar o servico contratado.",
      ],
    },
    {
      title: "4. Cookies no site publico",
      body: [
        "No site publico, cookies nao necessarios devem ser evitados por padrao ate que exista banner/central de preferencias adequada. Quando forem usados analytics ou marketing, o usuario devera receber informacoes claras e controles proporcionais.",
      ],
    },
    {
      title: "5. Como gerenciar",
      body: [
        "O usuario pode bloquear ou apagar cookies pelo navegador. O bloqueio de cookies necessarios pode impedir login, seguranca ou uso correto do Mise.",
        "Quando houver central de preferencias, ela permitira aceitar, rejeitar ou ajustar cookies nao necessarios.",
      ],
    },
    {
      title: "6. Retencao",
      body: [
        "Cookies de sessao duram ate o fechamento do navegador ou termino da sessao. Cookies persistentes, quando usados, devem ter prazo limitado e compativel com sua finalidade.",
      ],
    },
    {
      title: "7. Contato",
      body: [
        "Duvidas sobre cookies e privacidade devem ser enviadas para [EMAIL DE PRIVACIDADE A DEFINIR].",
      ],
    },
  ],
};

export const dataProcessingAgreement: LegalDocument = {
  title: "Acordo de Tratamento de Dados",
  eyebrow: "Controlador e operador",
  summary:
    "Anexo LGPD para restaurantes que usam o Mise para tratar dados de clientes finais, colaboradores e operacao.",
  lastUpdated,
  reviewNotice,
  sections: [
    {
      title: "1. Papel das partes",
      body: [
        "Para dados pessoais de clientes finais, colaboradores e contatos inseridos pelo restaurante no Mise, o restaurante contratante atua em regra como controlador e o Mise atua como operador.",
        "Para dados de leads, visitantes do site, administradores da conta e contatos comerciais diretos do Mise, o Mise pode atuar como controlador independente.",
      ],
    },
    {
      title: "2. Objeto e duracao",
      body: [
        "O tratamento ocorre para prestar o SaaS contratado, incluindo PDV, mesas, delivery, estoque, cozinha, relatorios, suporte, seguranca, fiscal, pagamentos e comunicacoes.",
        "O tratamento dura enquanto houver contrato, conta ativa, obrigacao legal, necessidade de seguranca, backup tecnico ou defesa de direitos.",
      ],
    },
    {
      title: "3. Categorias de titulares e dados",
      table: {
        headers: ["Titulares", "Dados tratados"],
        rows: [
          ["Usuarios do restaurante", "Nome, e-mail, cargo, unidade, permissoes, logs e acoes no sistema."],
          ["Clientes finais", "Nome, telefone, endereco, pedido, observacoes e historico operacional."],
          ["Entregadores/atendentes quando cadastrados", "Nome, contato, vinculos operacionais e registros de atendimento."],
          ["Representantes do contratante", "Dados comerciais, financeiros, suporte e cobranca."],
        ],
      },
    },
    {
      title: "4. Instrucoes do controlador",
      body: [
        "O Mise tratara dados pessoais conforme as instrucoes documentadas do restaurante, estes Termos, a Politica de Privacidade, configuracoes do sistema e exigencias legais aplicaveis.",
        "Caso uma instrucao pareca violar a LGPD ou gere risco relevante, o Mise podera alertar o contratante, recusar execucao ou limitar a funcionalidade ate esclarecimento.",
      ],
    },
    {
      title: "5. Obrigacoes do Mise como operador",
      bullets: [
        "Tratar dados apenas para prestar o servico contratado e finalidades compativeis.",
        "Adotar medidas de seguranca proporcionais ao risco e ao porte da operacao.",
        "Restringir acesso interno a pessoas que precisem tratar os dados.",
        "Apoiar o controlador no atendimento de titulares quando viavel e proporcional.",
        "Informar incidentes relevantes ao controlador sem demora injustificada apos confirmacao interna.",
        "Manter registros e evidencias tecnicas razoaveis sobre seguranca, acesso e tratamento.",
      ],
    },
    {
      title: "6. Obrigacoes do restaurante controlador",
      bullets: [
        "Definir base legal para coleta e uso dos dados de seus clientes e colaboradores.",
        "Informar seus clientes sobre o tratamento de dados, inclusive em delivery e WhatsApp.",
        "Cadastrar apenas dados necessarios, corretos e relacionados a operacao.",
        "Atender direitos de titulares sob sua responsabilidade.",
        "Controlar usuarios, permissoes, senhas, equipamentos, redes e politicas internas.",
        "Responder por campanhas promocionais, opt-out, consentimentos e regras de contato com clientes.",
      ],
    },
    {
      title: "7. Suboperadores",
      body: [
        "O contratante autoriza o uso de suboperadores necessarios ao servico, como provedores de hospedagem, banco de dados, autenticacao, pagamentos, WhatsApp, fiscal, suporte e seguranca.",
        "O Mise devera buscar fornecedores com medidas compativeis de seguranca e confidencialidade. Mudancas relevantes de suboperadores poderao ser comunicadas por atualizacao desta pagina, contrato ou aviso no sistema.",
      ],
    },
    {
      title: "8. Incidentes de seguranca",
      body: [
        "Ao identificar incidente confirmado que possa envolver dados pessoais tratados pelo Mise, o Mise adotara medidas de contencao, investigacao e mitigacao proporcionais.",
        "Quando o incidente puder acarretar risco ou dano relevante aos titulares sob controle do restaurante, o Mise comunicara o restaurante para que ele avalie as providencias de comunicacao a ANPD e aos titulares dentro dos prazos legais aplicaveis.",
      ],
    },
    {
      title: "9. Retorno, exportacao e eliminacao",
      body: [
        "Encerrada a contratacao, o restaurante podera solicitar exportacao de dados em formato disponivel pelo produto ou por suporte, quando tecnicamente viavel e comercialmente previsto.",
        "A eliminacao ou anonimizacao sera feita conforme prazos tecnicos, backups, obrigacoes legais e necessidade de defesa de direitos.",
      ],
    },
    {
      title: "10. Auditoria e evidencias",
      body: [
        "O restaurante podera solicitar informacoes razoaveis sobre medidas de seguranca e tratamento. Auditorias extensas, presenciais ou tecnicas dependerao de acordo previo, confidencialidade, escopo limitado e protecao dos demais clientes do Mise.",
      ],
    },
    {
      title: "11. Transferencias internacionais",
      body: [
        "Quando suboperadores processarem dados fora do Brasil, o Mise buscara medidas contratuais e tecnicas adequadas, observando a LGPD e orientacoes da ANPD quando aplicaveis.",
      ],
    },
    {
      title: "12. Conflito entre documentos",
      body: [
        "Este Acordo complementa os Termos de Uso e a Politica de Privacidade. Em caso de conflito sobre protecao de dados, este Acordo prevalecera para dados tratados pelo Mise como operador, salvo disposicao contratual especifica assinada entre as partes.",
      ],
    },
  ],
};
