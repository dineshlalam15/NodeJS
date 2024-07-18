Mongoose Schema: 
{
    type: String
    required: true - ensures that this field is mandatory.
    unique: true - ensures that each username is unique.
    lowercase: true - converts the username to lowercase.
    trim: true - removes any leading and trailing spaces.
    index: true - creates an index on this field for faster search.
}