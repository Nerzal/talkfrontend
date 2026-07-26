package main_test

func TestRepository(t *testing.T) {
	// Arrange
	// ...
	repo := NewRepository()

	// Act
    data, err := repo.Get()

	// Assert
    require.NoError(t, err)
}