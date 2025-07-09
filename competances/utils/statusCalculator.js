const calculerStatutGlobal = (sousCompetences) => {
  if (!sousCompetences || sousCompetences.length === 0) {
    return "Non validée";
  }

  const { valides, nonValides } = sousCompetences.reduce(
    (acc, sc) => {
      sc.validee ? acc.valides++ : acc.nonValides++;
      return acc;
    },
    { valides: 0, nonValides: 0 }
  );

  return valides >= nonValides ? "Validée" : "Non validée";
};

module.exports = { calculerStatutGlobal };
