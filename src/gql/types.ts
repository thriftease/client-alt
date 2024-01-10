export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
    [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
    [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
    [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
    T extends { [key: string]: unknown },
    K extends keyof T
> = { [_ in K]?: never };
export type Incremental<T> =
    | T
    | {
          [P in keyof T]?: P extends " $fragmentName" | "__typename"
              ? T[P]
              : never;
      };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
    ID: { input: string; output: string };
    String: { input: string; output: string };
    Boolean: { input: boolean; output: boolean };
    Int: { input: number; output: number };
    Float: { input: number; output: number };
    DateTime: { input: any; output: any };
    Decimal: { input: any; output: any };
    GenericScalar: { input: any; output: any };
};

export type AccountFilterQueryInput = {
    currency_Id_Icontains?: InputMaybe<Scalars["Decimal"]["input"]>;
    id_Icontains?: InputMaybe<Scalars["Decimal"]["input"]>;
    name_Icontains?: InputMaybe<Scalars["String"]["input"]>;
};

/** An enumeration. */
export enum AccountOrderQueryInput {
    CurrencyAsc = "CURRENCY_ASC",
    CurrencyDesc = "CURRENCY_DESC",
    IdAsc = "ID_ASC",
    IdDesc = "ID_DESC",
    NameAsc = "NAME_ASC",
    NameDesc = "NAME_DESC"
}

export type AccountType = {
    __typename?: "AccountType";
    balance?: Maybe<Scalars["Decimal"]["output"]>;
    currency: CurrencyType;
    futureBalance?: Maybe<Scalars["Decimal"]["output"]>;
    id: Scalars["ID"]["output"];
    name: Scalars["String"]["output"];
};

export type AuthSignInMutationPayload = {
    __typename?: "AuthSignInMutationPayload";
    payload: Scalars["GenericScalar"]["output"];
    refreshExpiresIn: Scalars["Int"]["output"];
    token: Scalars["String"]["output"];
    user?: Maybe<UserType>;
};

export type AuthVerifyMutationPayload = {
    __typename?: "AuthVerifyMutationPayload";
    payload: Scalars["GenericScalar"]["output"];
    user?: Maybe<UserType>;
};

export type CreateAccountMutationInput = {
    clientMutationId?: InputMaybe<Scalars["String"]["input"]>;
    currency: Scalars["ID"]["input"];
    name: Scalars["String"]["input"];
};

export type CreateAccountMutationPayload = {
    __typename?: "CreateAccountMutationPayload";
    clientMutationId?: Maybe<Scalars["String"]["output"]>;
    data?: Maybe<AccountType>;
    errors: Array<ErrorType>;
};

export type CreateCurrencyMutationInput = {
    abbreviation: Scalars["String"]["input"];
    clientMutationId?: InputMaybe<Scalars["String"]["input"]>;
    name: Scalars["String"]["input"];
    symbol: Scalars["String"]["input"];
};

export type CreateCurrencyMutationPayload = {
    __typename?: "CreateCurrencyMutationPayload";
    clientMutationId?: Maybe<Scalars["String"]["output"]>;
    data?: Maybe<CurrencyType>;
    errors: Array<ErrorType>;
};

export type CreateTagMutationInput = {
    clientMutationId?: InputMaybe<Scalars["String"]["input"]>;
    name: Scalars["String"]["input"];
};

export type CreateTagMutationPayload = {
    __typename?: "CreateTagMutationPayload";
    clientMutationId?: Maybe<Scalars["String"]["output"]>;
    data?: Maybe<TagType>;
    errors: Array<ErrorType>;
};

export type CreateTransactionMutationInput = {
    account: Scalars["ID"]["input"];
    amount?: InputMaybe<Scalars["Decimal"]["input"]>;
    clientMutationId?: InputMaybe<Scalars["String"]["input"]>;
    datetime?: InputMaybe<Scalars["DateTime"]["input"]>;
    description?: InputMaybe<Scalars["String"]["input"]>;
    name?: InputMaybe<Scalars["String"]["input"]>;
    tagIds?: InputMaybe<Array<Scalars["ID"]["input"]>>;
    tags?: InputMaybe<Array<Scalars["String"]["input"]>>;
};

export type CreateTransactionMutationPayload = {
    __typename?: "CreateTransactionMutationPayload";
    clientMutationId?: Maybe<Scalars["String"]["output"]>;
    data?: Maybe<TransactionType>;
    errors: Array<ErrorType>;
};

export type CreateUserMutationInput = {
    clientMutationId?: InputMaybe<Scalars["String"]["input"]>;
    email: Scalars["String"]["input"];
    familyName: Scalars["String"]["input"];
    givenName: Scalars["String"]["input"];
    middleName?: InputMaybe<Scalars["String"]["input"]>;
    password: Scalars["String"]["input"];
    suffix?: InputMaybe<Scalars["String"]["input"]>;
};

export type CreateUserMutationPayload = {
    __typename?: "CreateUserMutationPayload";
    clientMutationId?: Maybe<Scalars["String"]["output"]>;
    data?: Maybe<UserType>;
    errors: Array<ErrorType>;
};

export type CurrencyFilterQueryInput = {
    abbreviation_Icontains?: InputMaybe<Scalars["String"]["input"]>;
    id_Icontains?: InputMaybe<Scalars["Decimal"]["input"]>;
    name_Icontains?: InputMaybe<Scalars["String"]["input"]>;
    symbol_Icontains?: InputMaybe<Scalars["String"]["input"]>;
    user_Id_Icontains?: InputMaybe<Scalars["Decimal"]["input"]>;
};

/** An enumeration. */
export enum CurrencyOrderQueryInput {
    AbbreviationAsc = "ABBREVIATION_ASC",
    AbbreviationDesc = "ABBREVIATION_DESC",
    IdAsc = "ID_ASC",
    IdDesc = "ID_DESC",
    NameAsc = "NAME_ASC",
    NameDesc = "NAME_DESC",
    SymbolAsc = "SYMBOL_ASC",
    SymbolDesc = "SYMBOL_DESC",
    UserAsc = "USER_ASC",
    UserDesc = "USER_DESC"
}

export type CurrencyType = {
    __typename?: "CurrencyType";
    abbreviation: Scalars["String"]["output"];
    id: Scalars["ID"]["output"];
    name: Scalars["String"]["output"];
    symbol: Scalars["String"]["output"];
    user: UserType;
};

export type DeleteAccountMutationInput = {
    clientMutationId?: InputMaybe<Scalars["String"]["input"]>;
    id: Scalars["ID"]["input"];
};

export type DeleteAccountMutationPayload = {
    __typename?: "DeleteAccountMutationPayload";
    clientMutationId?: Maybe<Scalars["String"]["output"]>;
    data?: Maybe<AccountType>;
    errors: Array<ErrorType>;
};

export type DeleteCurrencyMutationInput = {
    clientMutationId?: InputMaybe<Scalars["String"]["input"]>;
    id: Scalars["ID"]["input"];
};

export type DeleteCurrencyMutationPayload = {
    __typename?: "DeleteCurrencyMutationPayload";
    clientMutationId?: Maybe<Scalars["String"]["output"]>;
    data?: Maybe<CurrencyType>;
    errors: Array<ErrorType>;
};

export type DeleteTagMutationInput = {
    clientMutationId?: InputMaybe<Scalars["String"]["input"]>;
    id: Scalars["ID"]["input"];
};

export type DeleteTagMutationPayload = {
    __typename?: "DeleteTagMutationPayload";
    clientMutationId?: Maybe<Scalars["String"]["output"]>;
    data?: Maybe<TagType>;
    errors: Array<ErrorType>;
};

export type DeleteTransactionMutationInput = {
    clientMutationId?: InputMaybe<Scalars["String"]["input"]>;
    id: Scalars["ID"]["input"];
};

export type DeleteTransactionMutationPayload = {
    __typename?: "DeleteTransactionMutationPayload";
    clientMutationId?: Maybe<Scalars["String"]["output"]>;
    data?: Maybe<TransactionType>;
    errors: Array<ErrorType>;
};

export type DeleteUserMutationInput = {
    clientMutationId?: InputMaybe<Scalars["String"]["input"]>;
};

export type DeleteUserMutationPayload = {
    __typename?: "DeleteUserMutationPayload";
    clientMutationId?: Maybe<Scalars["String"]["output"]>;
    data?: Maybe<UserType>;
    errors: Array<ErrorType>;
};

export type ErrorType = {
    __typename?: "ErrorType";
    field: Scalars["String"]["output"];
    messages: Array<Scalars["String"]["output"]>;
};

export type GetAccountQueryInput = {
    id: Scalars["ID"]["input"];
};

export type GetAccountQueryPayload = {
    __typename?: "GetAccountQueryPayload";
    data?: Maybe<AccountType>;
};

export type GetCurrencyQueryInput = {
    id: Scalars["ID"]["input"];
};

export type GetCurrencyQueryPayload = {
    __typename?: "GetCurrencyQueryPayload";
    data?: Maybe<CurrencyType>;
};

export type GetTagQueryInput = {
    id: Scalars["ID"]["input"];
};

export type GetTagQueryPayload = {
    __typename?: "GetTagQueryPayload";
    data?: Maybe<TagType>;
};

export type GetTransactionQueryInput = {
    id: Scalars["ID"]["input"];
};

export type GetTransactionQueryPayload = {
    __typename?: "GetTransactionQueryPayload";
    data?: Maybe<TransactionType>;
};

export type GetUserQueryPayload = {
    __typename?: "GetUserQueryPayload";
    data?: Maybe<UserType>;
};

export type ListAccountsQueryPayload = {
    __typename?: "ListAccountsQueryPayload";
    data: Array<Maybe<AccountType>>;
    paginator?: Maybe<PaginatorType>;
};

export type ListCurrenciesQueryPayload = {
    __typename?: "ListCurrenciesQueryPayload";
    data: Array<Maybe<CurrencyType>>;
    paginator?: Maybe<PaginatorType>;
};

export type ListTagsQueryPayload = {
    __typename?: "ListTagsQueryPayload";
    data: Array<Maybe<TagType>>;
    paginator?: Maybe<PaginatorType>;
};

export type ListTransactionsQueryPayload = {
    __typename?: "ListTransactionsQueryPayload";
    data: Array<Maybe<TransactionType>>;
    paginator?: Maybe<PaginatorType>;
};

export type Mutation = {
    __typename?: "Mutation";
    authSignIn?: Maybe<AuthSignInMutationPayload>;
    authSignUp?: Maybe<CreateUserMutationPayload>;
    authVerify?: Maybe<AuthVerifyMutationPayload>;
    createAccount?: Maybe<CreateAccountMutationPayload>;
    createCurrency?: Maybe<CreateCurrencyMutationPayload>;
    createTag?: Maybe<CreateTagMutationPayload>;
    createTransaction?: Maybe<CreateTransactionMutationPayload>;
    createUser?: Maybe<CreateUserMutationPayload>;
    deleteAccount?: Maybe<DeleteAccountMutationPayload>;
    deleteCurrency?: Maybe<DeleteCurrencyMutationPayload>;
    deleteTag?: Maybe<DeleteTagMutationPayload>;
    deleteTransaction?: Maybe<DeleteTransactionMutationPayload>;
    deleteUser?: Maybe<DeleteUserMutationPayload>;
    test?: Maybe<Scalars["String"]["output"]>;
    updateAccount?: Maybe<UpdateAccountMutationPayload>;
    updateCurrency?: Maybe<UpdateCurrencyMutationPayload>;
    updateTag?: Maybe<UpdateTagMutationPayload>;
    updateTransaction?: Maybe<UpdateTransactionMutationPayload>;
    updateUser?: Maybe<UpdateUserMutationPayload>;
};

export type MutationAuthSignInArgs = {
    email: Scalars["String"]["input"];
    password: Scalars["String"]["input"];
};

export type MutationAuthSignUpArgs = {
    input: CreateUserMutationInput;
};

export type MutationAuthVerifyArgs = {
    token?: InputMaybe<Scalars["String"]["input"]>;
};

export type MutationCreateAccountArgs = {
    input: CreateAccountMutationInput;
};

export type MutationCreateCurrencyArgs = {
    input: CreateCurrencyMutationInput;
};

export type MutationCreateTagArgs = {
    input: CreateTagMutationInput;
};

export type MutationCreateTransactionArgs = {
    input: CreateTransactionMutationInput;
};

export type MutationCreateUserArgs = {
    input: CreateUserMutationInput;
};

export type MutationDeleteAccountArgs = {
    input: DeleteAccountMutationInput;
};

export type MutationDeleteCurrencyArgs = {
    input: DeleteCurrencyMutationInput;
};

export type MutationDeleteTagArgs = {
    input: DeleteTagMutationInput;
};

export type MutationDeleteTransactionArgs = {
    input: DeleteTransactionMutationInput;
};

export type MutationDeleteUserArgs = {
    input: DeleteUserMutationInput;
};

export type MutationUpdateAccountArgs = {
    input: UpdateAccountMutationInput;
};

export type MutationUpdateCurrencyArgs = {
    input: UpdateCurrencyMutationInput;
};

export type MutationUpdateTagArgs = {
    input: UpdateTagMutationInput;
};

export type MutationUpdateTransactionArgs = {
    input: UpdateTransactionMutationInput;
};

export type MutationUpdateUserArgs = {
    input: UpdateUserMutationInput;
};

export type PageType = {
    __typename?: "PageType";
    current: Scalars["Int"]["output"];
    next?: Maybe<Scalars["Int"]["output"]>;
    previous?: Maybe<Scalars["Int"]["output"]>;
};

export type PaginatorQueryInput = {
    page?: InputMaybe<Scalars["Int"]["input"]>;
    perPage?: InputMaybe<Scalars["Int"]["input"]>;
};

export type PaginatorType = {
    __typename?: "PaginatorType";
    items: Scalars["Int"]["output"];
    page: PageType;
    pages: Scalars["Int"]["output"];
    perPage: Scalars["Int"]["output"];
};

export type Query = {
    __typename?: "Query";
    authExisting?: Maybe<Scalars["Boolean"]["output"]>;
    getAccount?: Maybe<GetAccountQueryPayload>;
    getCurrency?: Maybe<GetCurrencyQueryPayload>;
    getTag?: Maybe<GetTagQueryPayload>;
    getTransaction?: Maybe<GetTransactionQueryPayload>;
    getUser?: Maybe<GetUserQueryPayload>;
    listAccounts?: Maybe<ListAccountsQueryPayload>;
    listCurrencies?: Maybe<ListCurrenciesQueryPayload>;
    listTags?: Maybe<ListTagsQueryPayload>;
    listTransactions?: Maybe<ListTransactionsQueryPayload>;
    test?: Maybe<Scalars["String"]["output"]>;
};

export type QueryAuthExistingArgs = {
    email: Scalars["String"]["input"];
};

export type QueryGetAccountArgs = {
    input: GetAccountQueryInput;
};

export type QueryGetCurrencyArgs = {
    input: GetCurrencyQueryInput;
};

export type QueryGetTagArgs = {
    input: GetTagQueryInput;
};

export type QueryGetTransactionArgs = {
    input: GetTransactionQueryInput;
};

export type QueryListAccountsArgs = {
    filter?: InputMaybe<AccountFilterQueryInput>;
    order?: InputMaybe<Array<AccountOrderQueryInput>>;
    paginator?: InputMaybe<PaginatorQueryInput>;
};

export type QueryListCurrenciesArgs = {
    filter?: InputMaybe<CurrencyFilterQueryInput>;
    order?: InputMaybe<Array<CurrencyOrderQueryInput>>;
    paginator?: InputMaybe<PaginatorQueryInput>;
};

export type QueryListTagsArgs = {
    filter?: InputMaybe<TagFilterQueryInput>;
    order?: InputMaybe<Array<TagOrderQueryInput>>;
    paginator?: InputMaybe<PaginatorQueryInput>;
};

export type QueryListTransactionsArgs = {
    filter?: InputMaybe<TransactionFilterQueryInput>;
    order?: InputMaybe<Array<TransactionOrderQueryInput>>;
    paginator?: InputMaybe<PaginatorQueryInput>;
};

export type TagFilterQueryInput = {
    id_Icontains?: InputMaybe<Scalars["Decimal"]["input"]>;
    name_Icontains?: InputMaybe<Scalars["String"]["input"]>;
    user_Id_Icontains?: InputMaybe<Scalars["Decimal"]["input"]>;
};

/** An enumeration. */
export enum TagOrderQueryInput {
    IdAsc = "ID_ASC",
    IdDesc = "ID_DESC",
    NameAsc = "NAME_ASC",
    NameDesc = "NAME_DESC",
    UserAsc = "USER_ASC",
    UserDesc = "USER_DESC"
}

export type TagType = {
    __typename?: "TagType";
    id: Scalars["ID"]["output"];
    name: Scalars["String"]["output"];
    user: UserType;
};

export type TransactionFilterQueryInput = {
    account_Id_Icontains?: InputMaybe<Scalars["Decimal"]["input"]>;
    amount_Icontains?: InputMaybe<Scalars["Decimal"]["input"]>;
    datetime_Day?: InputMaybe<Scalars["Decimal"]["input"]>;
    datetime_Gt?: InputMaybe<Scalars["DateTime"]["input"]>;
    datetime_Gte?: InputMaybe<Scalars["DateTime"]["input"]>;
    datetime_Hour?: InputMaybe<Scalars["Decimal"]["input"]>;
    datetime_Icontains?: InputMaybe<Scalars["DateTime"]["input"]>;
    datetime_Lt?: InputMaybe<Scalars["DateTime"]["input"]>;
    datetime_Lte?: InputMaybe<Scalars["DateTime"]["input"]>;
    datetime_Minute?: InputMaybe<Scalars["Decimal"]["input"]>;
    datetime_Month?: InputMaybe<Scalars["Decimal"]["input"]>;
    /** Multiple values may be separated by commas. */
    datetime_Range?: InputMaybe<Scalars["DateTime"]["input"]>;
    datetime_Second?: InputMaybe<Scalars["Decimal"]["input"]>;
    datetime_Year?: InputMaybe<Scalars["Decimal"]["input"]>;
    description_Icontains?: InputMaybe<Scalars["String"]["input"]>;
    id_Icontains?: InputMaybe<Scalars["Decimal"]["input"]>;
    name_Icontains?: InputMaybe<Scalars["String"]["input"]>;
};

/** An enumeration. */
export enum TransactionOrderQueryInput {
    DatetimeAsc = "DATETIME_ASC",
    DatetimeDesc = "DATETIME_DESC",
    IdAsc = "ID_ASC",
    IdDesc = "ID_DESC"
}

export type TransactionType = {
    __typename?: "TransactionType";
    account: AccountType;
    amount: Scalars["Decimal"]["output"];
    datetime: Scalars["DateTime"]["output"];
    description: Scalars["String"]["output"];
    id: Scalars["ID"]["output"];
    name: Scalars["String"]["output"];
    resultingAccountBalance?: Maybe<Scalars["Decimal"]["output"]>;
    tagSet: Array<TagType>;
};

export type UpdateAccountMutationInput = {
    clientMutationId?: InputMaybe<Scalars["String"]["input"]>;
    currency?: InputMaybe<Scalars["ID"]["input"]>;
    id: Scalars["ID"]["input"];
    name?: InputMaybe<Scalars["String"]["input"]>;
};

export type UpdateAccountMutationPayload = {
    __typename?: "UpdateAccountMutationPayload";
    clientMutationId?: Maybe<Scalars["String"]["output"]>;
    data?: Maybe<AccountType>;
    errors: Array<ErrorType>;
};

export type UpdateCurrencyMutationInput = {
    clientMutationId?: InputMaybe<Scalars["String"]["input"]>;
    id: Scalars["ID"]["input"];
    name?: InputMaybe<Scalars["String"]["input"]>;
    symbol?: InputMaybe<Scalars["String"]["input"]>;
};

export type UpdateCurrencyMutationPayload = {
    __typename?: "UpdateCurrencyMutationPayload";
    clientMutationId?: Maybe<Scalars["String"]["output"]>;
    data?: Maybe<CurrencyType>;
    errors: Array<ErrorType>;
};

export type UpdateTagMutationInput = {
    clientMutationId?: InputMaybe<Scalars["String"]["input"]>;
    id: Scalars["ID"]["input"];
    name?: InputMaybe<Scalars["String"]["input"]>;
};

export type UpdateTagMutationPayload = {
    __typename?: "UpdateTagMutationPayload";
    clientMutationId?: Maybe<Scalars["String"]["output"]>;
    data?: Maybe<TagType>;
    errors: Array<ErrorType>;
};

export type UpdateTransactionMutationInput = {
    account?: InputMaybe<Scalars["ID"]["input"]>;
    addTagIds?: InputMaybe<Array<Scalars["ID"]["input"]>>;
    addTags?: InputMaybe<Array<Scalars["String"]["input"]>>;
    amount?: InputMaybe<Scalars["Decimal"]["input"]>;
    clientMutationId?: InputMaybe<Scalars["String"]["input"]>;
    datetime?: InputMaybe<Scalars["DateTime"]["input"]>;
    description?: InputMaybe<Scalars["String"]["input"]>;
    id: Scalars["ID"]["input"];
    name?: InputMaybe<Scalars["String"]["input"]>;
    removeTagIds?: InputMaybe<Array<Scalars["ID"]["input"]>>;
    removeTags?: InputMaybe<Array<Scalars["String"]["input"]>>;
};

export type UpdateTransactionMutationPayload = {
    __typename?: "UpdateTransactionMutationPayload";
    clientMutationId?: Maybe<Scalars["String"]["output"]>;
    data?: Maybe<TransactionType>;
    errors: Array<ErrorType>;
};

export type UpdateUserMutationInput = {
    clientMutationId?: InputMaybe<Scalars["String"]["input"]>;
    familyName?: InputMaybe<Scalars["String"]["input"]>;
    givenName?: InputMaybe<Scalars["String"]["input"]>;
    middleName?: InputMaybe<Scalars["String"]["input"]>;
    password?: InputMaybe<Scalars["String"]["input"]>;
    suffix?: InputMaybe<Scalars["String"]["input"]>;
};

export type UpdateUserMutationPayload = {
    __typename?: "UpdateUserMutationPayload";
    clientMutationId?: Maybe<Scalars["String"]["output"]>;
    data?: Maybe<UserType>;
    errors: Array<ErrorType>;
};

export type UserType = {
    __typename?: "UserType";
    email: Scalars["String"]["output"];
    familyName: Scalars["String"]["output"];
    fullName?: Maybe<Scalars["String"]["output"]>;
    givenName: Scalars["String"]["output"];
    id: Scalars["ID"]["output"];
    middleName: Scalars["String"]["output"];
    suffix: Scalars["String"]["output"];
};
