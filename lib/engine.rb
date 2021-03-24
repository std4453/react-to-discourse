module RtdTest
  class Engine < ::Rails::Engine
    engine_name "RtdTest".freeze
    isolate_namespace RtdTest

    config.after_initialize do
      Discourse::Application.routes.append do
        mount ::RtdTest::Engine, at: "//rtd-test"
      end
    end
  end
end
  