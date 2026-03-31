require("dotenv").config();

const { prisma } = require("../src/db/prisma");

const fakeResources = [
  {
    wording: "Mieux dialoguer après une tension familiale",
    content:
      "Quand une discussion se tend, l’objectif n’est pas de gagner mais de rouvrir un espace d’écoute. Cette ressource propose trois temps: se poser, reformuler ce que l’autre a dit, puis formuler une demande concrète. Elle peut être utilisée en famille ou dans un cadre d’accompagnement.",
    visibility: "PUBLIC",
    category: ["SOCIAL_SUPPORT"],
  },
  {
    wording: "Guide rapide pour reprendre contact avec un ami",
    content:
      "Un message court, sincère et sans justification excessive suffit souvent pour relancer une relation abîmée. Le guide recommande de reconnaître le silence, d’exprimer une intention claire et de laisser une marge de réponse à l’autre personne. Idéal pour une reprise de lien progressive.",
    visibility: "PUBLIC",
    category: ["EDUCATION"],
  },
  {
    wording: "Activité de cartes pour parler de sa journée",
    content:
      "Cette activité utilise des cartes simples pour nommer un ressenti, une difficulté ou un besoin. Elle peut être proposée à la maison, entre amis ou en atelier. Le but n’est pas la performance, mais la qualité de présence et la circulation de la parole.",
    visibility: "PUBLIC",
    category: ["EVENTS"],
  },
  {
    wording: "Repères pour alléger la charge mentale dans le couple",
    content:
      "La charge mentale se manifeste souvent dans les micro-anticipations invisibles. Cette ressource aide à repérer les irritants du quotidien, à répartir les tâches de façon réaliste et à instaurer un court rituel hebdomadaire de régulation. Contenu utile pour prévenir l’usure relationnelle.",
    visibility: "PRIVATE",
    category: ["SOCIAL_SUPPORT"],
  },
  {
    wording: "Préparer une activité de quartier inclusive",
    content:
      "Pour qu’une activité collective fonctionne, il faut penser à la clarté des consignes, à l’accessibilité des lieux et au rythme du groupe. Cette ressource rassemble quelques repères pour organiser un moment simple, rassurant et ouvert à des profils variés.",
    visibility: "PUBLIC",
    category: ["COMMUNITY"],
  },
];

async function main() {
  const users = await prisma.user.findMany({
    where: { is_anonymized: false },
    orderBy: { user_id: "asc" },
    select: { user_id: true },
  });

  if (users.length === 0) {
    throw new Error("Aucun utilisateur disponible pour rattacher les ressources.");
  }

  for (const [index, resource] of fakeResources.entries()) {
    const owner = users[index % users.length];

    const existing = await prisma.resources.findFirst({
      where: { wording: resource.wording },
      select: { ressource_id: true },
    });

    if (existing) {
      continue;
    }

    await prisma.resources.create({
      data: {
        wording: resource.wording,
        content: resource.content,
        visibility: resource.visibility,
        category: resource.category,
        user_id: owner.user_id,
      },
    });
  }

  console.log("Fake resources seeded.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
