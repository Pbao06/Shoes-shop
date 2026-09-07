FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY ["src.csproj", "./"]
RUN dotnet restore "src.csproj"
COPY . .
WORKDIR "/src"
RUN dotnet build "src.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "src.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "src.dll"]