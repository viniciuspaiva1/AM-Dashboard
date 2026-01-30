import { Course, PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
  // 1. Limpar o banco (Cuidado: deleta tudo)
  await prisma.cancellation.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.course.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.category.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();

  // 2. Criar Categorias Reais
  const catFundamental = await prisma.category.create({
    data: { description: "Ensino Fundamental II" },
  });
  const catMedio = await prisma.category.create({
    data: { description: "Ensino Médio" },
  });
  const catEnem = await prisma.category.create({
    data: { description: "Pré-Enem e Cursinhos" },
  });

  // 3. Criar Cursos
  const coursesData = [
    { name: "6º Ano - Completo", price: 45.0, categoryId: catFundamental.id },
    { name: "7º Ano - Completo", price: 45.0, categoryId: catFundamental.id },
    { name: "8º Ano - Completo", price: 45.0, categoryId: catFundamental.id },
    { name: "9º Ano - Intensivo", price: 55.0, categoryId: catFundamental.id },
    {
      name: "1º Ano Médio",
      price: 90.0,
      categoryId: catMedio.id,
    },
    {
      name: "2º Ano Médio",
      price: 90.0,
      categoryId: catMedio.id,
    },
    {
      name: "3º Ano Médio - Foco Vestibular",
      price: 120.0,
      categoryId: catMedio.id,
    },
    { name: "Extensivo ENEM 2026", price: 200.0, categoryId: catEnem.id },
  ];

  const createdCourses: Course[] = [];
  for (const c of coursesData) {
    const course = await prisma.course.create({ data: c });
    createdCourses.push(course);
  }

  // 4. Criar Usuários, Perfis e Vendas (Simulando últimos 6 meses)
  for (let i = 0; i < 40; i++) {
    const randomDate = faker.date.past({ years: 0.5 }); // Vendas nos últimos 6 meses

    const user = await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: "hash_fake_password", // Em um app real, use bcrypt aqui
        createdAt: randomDate,
        profile: {
          create: {
            phone: faker.phone.number(),
            birthday: faker.date.birthdate({ min: 12, max: 25, mode: "age" }),
            gender: faker.helpers.arrayElement(["Masc", "Fem", "Outro"]),
          },
        },
      },
    });

    // Criar Assinatura para este usuário
    const course = faker.helpers.arrayElement(createdCourses);
    const status = faker.helpers.arrayElement([
      "active",
      "active",
      "active",
      "cancelled",
    ]); // Mais ativos que cancelados

    const subscription = await prisma.subscription.create({
      data: {
        status,
        saleDate: randomDate,
        paidPrice: course.price,
        userId: user.id,
        courseId: course.id,
      },
    });

    // Se estiver cancelado, criar registro de cancelamento
    if (status === "cancelled") {
      await prisma.cancellation.create({
        data: {
          reason: faker.helpers.arrayElement([
            "Preço alto",
            "Mudança de cidade",
            "Dificuldade na plataforma",
          ]),
          cancellationDate: faker.date.between({
            from: randomDate,
            to: new Date(),
          }),
          subscriptionId: subscription.id,
        },
      });
    }

    // Lógica de Pagamentos Recorrentes
    const hoje = new Date();
    let dataReferencia = new Date(randomDate);

    // Enquanto a data da mensalidade for anterior ou igual a hoje
    while (dataReferencia <= hoje) {
      await prisma.payment.create({
        data: {
          // Se a assinatura está ativa, o pagamento foi feito.
          // Se está cancelada, vamos simular que os últimos falharam ou não existem.
          status: status === "active" ? "paid" : "failed",
          paidAt: status === "active" ? new Date(dataReferencia) : null,
          subscriptionId: subscription.id,
        },
      });

      // Avança 1 mês para a próxima mensalidade
      dataReferencia.setMonth(dataReferencia.getMonth() + 1);
    }
  }
  // 5. Criar Leads (Para o gráfico de conversão)
  for (let i = 0; i < 60; i++) {
    await prisma.lead.create({
      data: {
        status: faker.helpers.arrayElement([
          "new",
          "in_progress",
          "converted",
          "lost",
        ]),
        source: faker.helpers.arrayElement([
          "Instagram",
          "Google Search",
          "YouTube",
          "Indicação",
        ]),
        contactData: faker.phone.number(),
        interestedCategoryId: faker.helpers.arrayElement([
          catFundamental.id,
          catMedio.id,
          catEnem.id,
        ]),
        createdAt: faker.date.past({ years: 0.5 }),
      },
    });
  }

  console.log("Seed finalizado com sucesso! 🌱");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
