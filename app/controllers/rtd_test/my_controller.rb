module RtdTest
  class MyController < ::ApplicationController
    requires_plugin RtdTest

    before_action :ensure_logged_in

    def index
    end
  end
end
