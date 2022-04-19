namespace shared.models;

[Serializable]
public class ServerProperties
{
    public bool EnableJmXMonitoring { get; set; }
    public int RconPort { get; set; }
    public int? LevelSeed { get; set; }
    public string GameMode { get; set; }
    public bool EnableCommandBlock { get; set; }
    public bool EnableQuery { get; set; }
    public object GeneratorSettings;
    public string LevelName { get; set; }
    public string Motd { get; set; }
    public int QueryPort { get; set; }
    public bool PvP { get; set; }
    public bool GenerateStructures { get; set; }
    public string MaxChainedNeighborUpdates { get; set; }
    public string difficulty { get; set; }
    public int NetworkCompressionThreshold { get; set; }
    public bool RequireResourcePack { get; set; }
    public int MaxTickTime { get; set; }
    public bool UseNativeTransport { get; set; }
}