export default (mongoose) => {
  const accountSchema = mongoose.Schema({
    agencia: {
      type: Number,
      required: true,
    },
    conta: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    balance: {
      type: Number,
      required: true,
      validate(value) {
        if (value < 0) throw new Error('Valor não pode ser negativo');
      },
    },
  });

  const accountModel = mongoose.model('accounts', accountSchema, 'accounts');
  return accountModel;
};
