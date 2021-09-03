import schema from "./schema/orderedEquipmentsSchema.json";

export const orderedConstructorEquipments = (equipments) => {
  const orderedConstructorEquipments = {
    other: [],
    outsideEquipment: [],
    interiorEquipment: [],
    entertainmentEquipment: [],
    comfortEquipment: [],
    safetyEquipment: [],
    noEquipments: true,
  };
  if (!equipments && !equipments?.length) {
    return orderedConstructorEquipments;
  }
  const flatEquipments = Object.values(equipments).flatMap(
    (subEquipment) => subEquipment
  );

  const ranks = [
    "other",
    "outsideEquipment",
    "interiorEquipment",
    "entertainmentEquipment",
    "comfortEquipment",
    "safetyEquipment",
  ];

  Object.entries(schema).map(([key, value]) => {
    Object.values(flatEquipments).map((item) => {
      if (item === value.key) {
        orderedConstructorEquipments[ranks[value.rank]].push(item);
        orderedConstructorEquipments["noEquipments"] = false;
      }
    });
  });

  return orderedConstructorEquipments;
};
