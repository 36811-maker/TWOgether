import { db } from "./index";
import { sql } from "drizzle-orm";
import {
  users,
  coupleSpace,
  goals,
  dreams,
  calendarEvents,
  homePlans,
  finances,
  trips,
  memories,
  letters,
  timeline,
  notesBoard,
} from "./schema";
import { eq } from "drizzle-orm";

let isInitialized = false;

export async function ensureDatabaseInitialized() {
  if (isInitialized) return;

  try {
    // 0. Ensure tables exist
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        avatar TEXT,
        role TEXT DEFAULT 'partner',
        current_mood TEXT DEFAULT 'Apaixonado(a) 🥰',
        mood_updated_at TIMESTAMP DEFAULT NOW(),
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS couple_space (
        id SERIAL PRIMARY KEY,
        name TEXT DEFAULT 'Pedro & Emilly',
        slogan TEXT DEFAULT 'Our future, together.',
        invite_code TEXT DEFAULT 'TWOGETHER-2025',
        anniversary_date TEXT DEFAULT '2023-05-13',
        story_summary TEXT DEFAULT 'Construindo cada detalhe do nosso futuro, lado a lado, com carinho, cumplicidade e amor infinito.',
        updated_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS goals (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        category TEXT NOT NULL DEFAULT 'Vida a Dois',
        target_date TEXT,
        progress INTEGER DEFAULT 0,
        status TEXT DEFAULT 'Em andamento',
        created_by TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS dreams (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        category TEXT NOT NULL DEFAULT 'Experiências',
        priority TEXT DEFAULT 'Alta',
        estimated_cost TEXT,
        completed BOOLEAN DEFAULT FALSE,
        completed_date TEXT,
        image_url TEXT,
        created_by TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS calendar_events (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        date TEXT NOT NULL,
        time TEXT,
        category TEXT NOT NULL DEFAULT 'Encontro',
        is_milestone BOOLEAN DEFAULT FALSE,
        countdown BOOLEAN DEFAULT TRUE,
        location TEXT,
        created_by TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS home_plans (
        id SERIAL PRIMARY KEY,
        room TEXT NOT NULL DEFAULT 'Sala de Estar',
        item TEXT NOT NULL,
        description TEXT,
        priority TEXT DEFAULT 'Essencial',
        estimated_price TEXT,
        purchased BOOLEAN DEFAULT FALSE,
        inspiration_url TEXT,
        notes TEXT,
        created_by TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS finances (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        type TEXT NOT NULL DEFAULT 'reserva',
        amount TEXT NOT NULL,
        target_amount TEXT,
        category TEXT NOT NULL DEFAULT 'Casa Nova',
        payer TEXT DEFAULT 'Ambos',
        date TEXT,
        notes TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS trips (
        id SERIAL PRIMARY KEY,
        destination TEXT NOT NULL,
        start_date TEXT,
        end_date TEXT,
        status TEXT DEFAULT 'Planejando',
        budget TEXT,
        cover_image TEXT,
        itinerary TEXT DEFAULT '[]',
        packing_list TEXT DEFAULT '[]',
        places_to_visit TEXT DEFAULT '[]',
        notes TEXT,
        created_by TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS memories (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        date TEXT NOT NULL,
        location TEXT,
        image_url TEXT NOT NULL DEFAULT '',
        caption TEXT,
        category TEXT DEFAULT 'Especial',
        favorite BOOLEAN DEFAULT FALSE,
        created_by TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS letters (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        sender TEXT NOT NULL,
        recipient TEXT NOT NULL,
        content TEXT NOT NULL,
        type TEXT DEFAULT 'carta_amor',
        open_condition TEXT,
        unlock_date TEXT,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS timeline (
        id SERIAL PRIMARY KEY,
        date TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        category TEXT DEFAULT 'Marco',
        image_url TEXT,
        "order" INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS notes_board (
        id SERIAL PRIMARY KEY,
        author TEXT NOT NULL,
        content TEXT NOT NULL,
        color TEXT DEFAULT 'rose',
        pinned BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // 1. Ensure Users (Pedro & Emilly)
    const emailOne = (process.env.USER_ONE_EMAIL || "pedro@gmail.com").trim().toLowerCase();
    const passOne = process.env.USER_ONE_PASSWORD || "13052009";
    const emailTwo = (process.env.USER_TWO_EMAIL || "emilly@gmail.com").trim().toLowerCase();
    const passTwo = process.env.USER_TWO_PASSWORD || "11042011";

    const existingUserOne = await db
      .select()
      .from(users)
      .where(eq(users.email, emailOne))
      .limit(1);

    if (existingUserOne.length === 0) {
      await db.insert(users).values({
        email: emailOne,
        password: passOne,
        name: "Pedro",
        avatar: null,
        role: "partner",
        currentMood: "Te amando mais a cada dia 💖",
      });
    }

    const existingUserTwo = await db
      .select()
      .from(users)
      .where(eq(users.email, emailTwo))
      .limit(1);

    if (existingUserTwo.length === 0) {
      await db.insert(users).values({
        email: emailTwo,
        password: passTwo,
        name: "Emilly",
        avatar: null,
        role: "partner",
        currentMood: "Contando os minutos para o nosso próximo plano ✨",
      });
    }

    // 2. Ensure Couple Space
    const existingSpace = await db.select().from(coupleSpace).limit(1);
    if (existingSpace.length === 0) {
      await db.insert(coupleSpace).values({
        name: "Pedro & Emilly",
        slogan: "Our future, together.",
        inviteCode: "TWOGETHER-2025",
        anniversaryDate: "2023-05-13",
        storySummary:
          "Construindo cada detalhe do nosso futuro, lado a lado, com carinho, cumplicidade e amor infinito.",
      });
    }

    // 3. Ensure Goals
    const existingGoals = await db.select().from(goals).limit(1);
    if (existingGoals.length === 0) {
      await db.insert(goals).values([
        {
          title: "Comprar nosso primeiro apartamento",
          description: "Economizar a entrada para o nosso apê com varandinha e sol da manhã.",
          category: "Moradia",
          targetDate: "2026-12-31",
          progress: 45,
          status: "Em andamento",
          createdBy: "Pedro",
        },
        {
          title: "Viagem inesquecível para Paris e Itália",
          description: "15 dias caminhando pelas ruas de Roma, Florença e jantando com vista para a Torre Eiffel.",
          category: "Viagem",
          targetDate: "2025-10-15",
          progress: 70,
          status: "Em andamento",
          createdBy: "Emilly",
        },
        {
          title: "Criar nossa reserva conjunta de tranquilidade",
          description: "Alcançar 6 meses de despesas guardadas para termos total paz de espírito.",
          category: "Financeiro",
          targetDate: "2025-12-01",
          progress: 80,
          status: "Em andamento",
          createdBy: "Pedro",
        },
        {
          title: "Montar nosso cantinho do café gourmet",
          description: "Cafeteira espresso, moedor e xícaras de cerâmica personalizadas.",
          category: "Vida a Dois",
          targetDate: "2025-06-20",
          progress: 90,
          status: "Concluído",
          createdBy: "Emilly",
        },
      ]);
    }

    // 4. Ensure Dreams
    const existingDreams = await db.select().from(dreams).limit(1);
    if (existingDreams.length === 0) {
      await db.insert(dreams).values([
        {
          title: "Ver a Aurora Boreal juntinhos na Noruega",
          description: "Dormir em um iglu de vidro e ver o céu dançar verde e lilás abraçados.",
          category: "Aventuras",
          priority: "Especial",
          estimatedCost: "R$ 28.000",
          completed: false,
          imageUrl: null,
          createdBy: "Emilly",
        },
        {
          title: "Adotar um filhote golden retriever e correr no parque",
          description: "Nosso futuro companheiro de quatro patas para encher a casa de festa.",
          category: "Vida a Dois",
          priority: "Alta",
          estimatedCost: "R$ 3.500",
          completed: false,
          imageUrl: null,
          createdBy: "Pedro",
        },
        {
          title: "Piquenique ao pôr do sol em Cinque Terre",
          description: "Pão italiano, queijo artesanal, vinho branco e o mar azul da Riviera Italiana.",
          category: "Romântico",
          priority: "Alta",
          estimatedCost: "R$ 1.200",
          completed: false,
          imageUrl: null,
          createdBy: "Emilly",
        },
        {
          title: "Cerimônia de casamento intimista ao ar livre",
          description: "Luzes de fada no bosque, nossos melhores amigos e votos cheios de amor.",
          category: "Bens & Conquistas",
          priority: "Especial",
          estimatedCost: "R$ 45.000",
          completed: false,
          imageUrl: null,
          createdBy: "Pedro",
        },
      ]);
    }

    // 5. Calendar Events
    const existingEvents = await db.select().from(calendarEvents).limit(1);
    if (existingEvents.length === 0) {
      await db.insert(calendarEvents).values([
        {
          title: "Nosso Aniversário de Namoro ❤️",
          description: "Dia de celebrar mais um ano da melhor história de amor do mundo!",
          date: "2025-05-13",
          time: "20:00",
          category: "Aniversário",
          isMilestone: true,
          countdown: true,
          location: "Jantar surpresa",
          createdBy: "Pedro",
        },
        {
          title: "Noite Especial de Fondue e Filmes",
          description: "Sessão cinema particular na sala com chocolates, frutas e cobertores.",
          date: "2025-04-18",
          time: "20:30",
          category: "Encontro",
          isMilestone: false,
          countdown: true,
          location: "Em casa",
          createdBy: "Emilly",
        },
        {
          title: "Showroom da Futura Casa",
          description: "Escolher a paleta de cores para os quartos e iluminação de led.",
          date: "2025-04-26",
          time: "14:00",
          category: "Compromisso",
          isMilestone: false,
          countdown: true,
          location: "Design Center",
          createdBy: "Pedro",
        },
      ]);
    }

    // 6. Home Plans
    const existingHome = await db.select().from(homePlans).limit(1);
    if (existingHome.length === 0) {
      await db.insert(homePlans).values([
        {
          room: "Sala de Estar",
          item: "Sofá retrátil e reclinável linho cru",
          description: "Super espaçoso, macio e perfeito para maratonar séries abraçados.",
          priority: "Essencial",
          estimatedPrice: "R$ 4.200",
          purchased: true,
          inspirationUrl: null,
          notes: "Medir a parede lateral antes de confirmar a entrega.",
          createdBy: "Pedro",
        },
        {
          room: "Cozinha",
          item: "Ilha central com cooktop por indução e banquetas altas",
          description: "Espaço para cozinhar juntos enquanto conversamos e tomamos um vinho.",
          priority: "Essencial",
          estimatedPrice: "R$ 6.800",
          purchased: false,
          inspirationUrl: null,
          notes: "Acabamento em quartzo branco calacata.",
          createdBy: "Emilly",
        },
        {
          room: "Quarto Principal",
          item: "Cama Queen Size com cabeceira estofada e lençóis 400 fios",
          description: "Conforto de hotel cinco estrelas para nosso refúgio de paz.",
          priority: "Essencial",
          estimatedPrice: "R$ 3.800",
          purchased: false,
          inspirationUrl: null,
          notes: "Com iluminação quente indireta em LED atrás do painel.",
          createdBy: "Emilly",
        },
        {
          room: "Varanda/Jardim",
          item: "Jardim vertical de ervas frescas e poltronas de corda náutica",
          description: "Manjericão, alecrim e hortelã para as nossas receitas de domingo.",
          priority: "Desejo",
          estimatedPrice: "R$ 1.900",
          purchased: false,
          inspirationUrl: null,
          notes: "Sistema de irrigação gota a gota automático.",
          createdBy: "Pedro",
        },
      ]);
    }

    // 7. Finances
    const existingFinances = await db.select().from(finances).limit(1);
    if (existingFinances.length === 0) {
      await db.insert(finances).values([
        {
          title: "Fundo Entrada do Apê",
          type: "reserva",
          amount: "R$ 48.500",
          targetAmount: "R$ 90.000",
          category: "Casa Nova",
          payer: "Ambos",
          date: "2025-04-01",
          notes: "Rendimento automático em CDB 100% CDI.",
        },
        {
          title: "Caixinha Viagem Europa",
          type: "reserva",
          amount: "R$ 14.200",
          targetAmount: "R$ 20.000",
          category: "Viagem dos Sonhos",
          payer: "Ambos",
          date: "2025-04-01",
          notes: "Comprando euros aos poucos nos dias favoráveis.",
        },
        {
          title: "Reserva de Emergência & Paz de Espírito",
          type: "reserva",
          amount: "R$ 22.000",
          targetAmount: "R$ 30.000",
          category: "Reserva de Emergência",
          payer: "Ambos",
          date: "2025-03-28",
          notes: "Garantia para qualquer imprevisto sem tocar nos nossos sonhos.",
        },
        {
          title: "Aporte Mensal Compartilhado",
          type: "contribuicao",
          amount: "R$ 3.000",
          category: "Casa Nova",
          payer: "Ambos",
          date: "2025-03-25",
          notes: "R$ 1.500 Pedro + R$ 1.500 Emilly.",
        },
      ]);
    }

    // 8. Trips
    const existingTrips = await db.select().from(trips).limit(1);
    if (existingTrips.length === 0) {
      await db.insert(trips).values([
        {
          destination: "Campos do Jordão Romântico",
          startDate: "2025-07-10",
          endDate: "2025-07-14",
          status: "Confirmada",
          budget: "R$ 3.800",
          coverImage: null,
          itinerary: JSON.stringify([
            { day: "Dia 1", activity: "Check-in na pousada com lareira e fondue no centro de Capivari à noite" },
            { day: "Dia 2", activity: "Passeio pelo Parque Amantikir pela manhã e degustação de vinhos" },
            { day: "Dia 3", activity: "Pico do Itapeva para ver as montanhas e café da tarde especial" },
            { day: "Dia 4", activity: "Manhã de compras de chocolates artesanais e retorno tranquilos" },
          ]),
          packingList: JSON.stringify([
            { item: "Casacos quentes e mantas", checked: true, owner: "Ambos" },
            { item: "Fones de ouvido e carregadores", checked: true, owner: "Pedro" },
            { item: "Botas confortáveis de caminhada", checked: true, owner: "Emilly" },
            { item: "Playlist para a serra", checked: true, owner: "Pedro" },
          ]),
          placesToVisit: JSON.stringify([
            "Parque Amantikir",
            "Pico do Itapeva",
            "Vila Capivari",
            "Restaurante Baden Baden",
          ]),
          notes: "Reservar chalé com lareira e vista para as montanhas.",
          createdBy: "Pedro",
        },
        {
          destination: "Tour dos Sonhos: Paris e Costa Amalfitana",
          startDate: "2025-10-12",
          endDate: "2025-10-26",
          status: "Planejando",
          budget: "R$ 22.000",
          coverImage: null,
          itinerary: JSON.stringify([
            { day: "Dias 1-5", activity: "Paris: Museu do Louvre, Torre Eiffel iluminada, cruzeiro no Sena" },
            { day: "Dias 6-10", activity: "Florença & Toscana: Vinhedos, pôr do sol na Piazzale Michelangelo" },
            { day: "Dias 11-14", activity: "Positano & Capri: Barco pelas grutas marinhas e massa fresca" },
          ]),
          packingList: JSON.stringify([
            { item: "Passaportes válidos", checked: true, owner: "Ambos" },
            { item: "Seguro viagem internacional", checked: false, owner: "Pedro" },
            { item: "Adaptador de tomada europeu", checked: true, owner: "Pedro" },
            { item: "Looks confortáveis para caminhar", checked: false, owner: "Emilly" },
          ]),
          placesToVisit: JSON.stringify([
            "Torre Eiffel",
            "Museu D'Orsay",
            "Duomo de Florença",
            "Praia de Positano",
          ]),
          notes: "Acompanhar alerta de passagens aéreas e milhas.",
          createdBy: "Emilly",
        },
      ]);
    }

    // 9. Memories
    const existingMemories = await db.select().from(memories).limit(1);
    if (existingMemories.length === 0) {
      await db.insert(memories).values([
        {
          title: "Nosso primeiro encontro oficial",
          date: "2023-05-13",
          location: "Cafeteria da Praça",
          imageUrl: "",
          caption: "O dia em que três horas de conversa pareceram apenas cinco minutos. A certeza de que tínhamos encontrado algo único.",
          category: "Primeiros Momentos",
          favorite: true,
          createdBy: "Pedro",
        },
        {
          title: "O pôr do sol inesquecível na praia",
          date: "2023-11-20",
          location: "Praia do Rosa",
          imageUrl: "",
          caption: "Ondas quebrando de mansinho e você sorrindo com o vento no cabelo. Eu soube naquele instante que era você para sempre.",
          category: "Viagens",
          favorite: true,
          createdBy: "Pedro",
        },
        {
          title: "Primeiro jantar que cozinhamos juntos",
          date: "2024-02-14",
          location: "Nossa cozinha improvisada",
          imageUrl: "",
          caption: "Farinha por toda a bancada, muito riso e o melhor risoto de cogumelos do mundo.",
          category: "Dia a Dia",
          favorite: false,
          createdBy: "Emilly",
        },
        {
          title: "Comemoração de 1 Ano Juntos",
          date: "2024-05-13",
          location: "Mirante da Cidade",
          imageUrl: "",
          caption: "365 dias de cumplicidade, apoio incondicional e o amor mais leve e bonito do mundo.",
          category: "Datas Especiais",
          favorite: true,
          createdBy: "Emilly",
        },
      ]);
    }

    // 10. Letters & Time Capsule
    const existingLetters = await db.select().from(letters).limit(1);
    if (existingLetters.length === 0) {
      await db.insert(letters).values([
        {
          title: "Minha declaração para você hoje e sempre",
          sender: "Pedro",
          recipient: "Emilly",
          content:
            "Minha vida, quando olho para tudo que sonhamos nesta plataforma TWOgether, meu coração transborda de alegria e serenidade. Ter você como parceira de vida, confidente e grande amor é o maior presente que Deus me deu. Mal posso esperar para acordar todos os dias ao seu lado na nossa casa. Amo você infinitamente!",
          type: "carta_amor",
          openCondition: "Sempre que quiser lembrar o quanto é amada",
          unlockDate: null,
          isRead: true,
        },
        {
          title: "Abra no dia em que pegarmos a chave do nosso apê 🔑",
          sender: "Emilly",
          recipient: "Pedro",
          content:
            "Meu amor! Se você está lendo isso, nós conseguimos! Todas as planilhas, cada economia na caixinha, cada sonho anotado aqui virou realidade concreta. Olha em volta desse chão vazio: aqui começa o nosso lar, a nossa história de verdade. Obrigada por nunca soltar minha mão. Vamos mobiliar tudo juntinhos!",
          type: "capsula_tempo",
          openCondition: "Abra exclusivamente no dia de pegar a chave do apartamento",
          unlockDate: "2026-12-31",
          isRead: false,
        },
        {
          title: "Abra quando você tiver um dia cansativo ou difícil ❤️",
          sender: "Pedro",
          recipient: "Emilly",
          content:
            "Ei, respira fundo. Deixa o cansaço do mundo lá fora. Você é a mulher mais talentosa, dedicada e incrível que eu conheço. Não precisa carregar o peso de tudo sozinha; eu estou aqui com você, pro que der e vier. Hoje você só precisa relaxar, tomar um banho gostoso e receber todo meu carinho. Eu cuido do jantar!",
          type: "abra_quando",
          openCondition: "Abra quando tiver um dia pesado e precisar de um abraço",
          unlockDate: null,
          isRead: false,
        },
      ]);
    }

    // 11. Timeline
    const existingTimeline = await db.select().from(timeline).limit(1);
    if (existingTimeline.length === 0) {
      await db.insert(timeline).values([
        {
          date: "13/05/2023",
          title: "O Começo de Tudo",
          description: "Nosso primeiro café que durou a tarde inteira e o início da nossa história mágica.",
          category: "Início",
          imageUrl: null,
          order: 1,
        },
        {
          date: "12/08/2023",
          title: "Pedido Oficial de Namoro",
          description: "Sob a luz das estrelas e um 'Sim' emocionado que selou nossa jornada.",
          category: "Marco",
          imageUrl: null,
          order: 2,
        },
        {
          date: "10/01/2024",
          title: "Primeira Grande Viagem Juntos",
          description: "Dias ensolarados na praia, muitas risadas e a certeza de que nossa sintonia é perfeita.",
          category: "Viagem",
          imageUrl: null,
          order: 3,
        },
        {
          date: "15/01/2025",
          title: "Criamos nossa Plataforma TWOgether",
          description: "Lançamento oficial do nosso portal de vida a dois: 'Our future, together.'",
          category: "Sonho Realizado",
          imageUrl: null,
          order: 4,
        },
        {
          date: "Futuro Próximo",
          title: "Nossa Casa e o 'Para Sempre'",
          description: "O próximo grande passo da nossa caminhada: chaves na mão e nossos votos de casamento.",
          category: "Próximo Capítulo",
          imageUrl: null,
          order: 5,
        },
      ]);
    }

    // 12. Notes Board
    const existingNotes = await db.select().from(notesBoard).limit(1);
    if (existingNotes.length === 0) {
      await db.insert(notesBoard).values([
        {
          author: "Pedro",
          content: "Bom dia, meu amor! Deixei café passado para você e não esquece que hoje à noite tem sessão cinema! Te amo! ☕❤️",
          color: "rose",
          pinned: true,
        },
        {
          author: "Emilly",
          content: "Você é meu lugar favorito no mundo todinho. Obrigada por ser tão parceiro sempre! ✨🥰",
          color: "amber",
          pinned: true,
        },
      ]);
    }

    isInitialized = true;
  } catch (error) {
    console.error("Database initialization notice:", error);
  }
}
