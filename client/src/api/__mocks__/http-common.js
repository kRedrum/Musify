const mockAxios = jest.createMockFromModule('axios')

mockAxios.create = jest.fn()
mockAxios.create.mockReturnValue(mockAxios)

const mockBaseApi = mockAxios.create()

export default mockBaseApi
